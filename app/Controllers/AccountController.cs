using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using app.DataLayer.Models;


namespace app.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;
        private readonly ILogger _logger;
        private readonly IOptions<AppConfiguration> _appConfiguration;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            IPasswordHasher<ApplicationUser> passwordHasher,
            ILoggerFactory loggerFactory,
            IOptions<AppConfiguration> appConfiguration)
        {
            _userManager = userManager;
            _passwordHasher = passwordHasher;
            _logger = loggerFactory.CreateLogger<AccountController>();
            _appConfiguration = appConfiguration;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create(ApplicationUserDTO model)
        {
            // if (!ModelState.IsValid)
            // {
            //     return
            //         BadRequest(
            //             ModelState.Values.SelectMany(v => v.Errors)
            //                 .Select(modelError => modelError.ErrorMessage)
            //                 .ToList());
            // }

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(x => x.Description).ToList());
            }

            return Ok(user);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Token(ApplicationUserDTO model)
        {
            // if (!ModelState.IsValid)
            // {
            //     return BadRequest();
            // }

            var user = await _userManager.FindByNameAsync(model.Email);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password) != PasswordVerificationResult.Success)
            {
                return BadRequest();
            }

            var token = await GetJwtSecurityToken(user);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }

        /// <summary>
        /// Generate JWT Token based on valid User
        /// </summary>
        private async Task<JwtSecurityToken> GetJwtSecurityToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);

            return new JwtSecurityToken(
                issuer: _appConfiguration.Value.SiteUrl,
                audience: _appConfiguration.Value.SiteUrl,
                claims: GetTokenClaims(user).Union(userClaims),
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appConfiguration.Value.Key)), SecurityAlgorithms.HmacSha256)
            );
        }

        /// <summary>
        /// Generate additional JWT Token Claims.
        /// Use to any additional claims you might need.
        /// https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4
        /// </summary>
        private static IEnumerable<Claim> GetTokenClaims(ApplicationUser user)
        {
            return new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName)
            };
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Validate()
        {   
            // parse token information
            var authenticateInfo = await HttpContext.Authentication.GetAuthenticateInfoAsync("Bearer");
            string accessToken = authenticateInfo.Properties.Items[".Token.access_token"];
            string userId = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            string jti = this.User.FindFirstValue("jit");
            string tokenExp = this.User.FindFirstValue("exp");

            _logger.LogInformation($"JWT : {accessToken}");
            _logger.LogInformation($"UserId: {userId}");
            _logger.LogInformation($"JTI: {jti}");
            _logger.LogInformation($"Expiration: {tokenExp}");

            // convert Unix Timestamp to DateTime object
            int tokenExpInt = Int32.Parse(tokenExp);
            DateTime tokenExpDate = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            tokenExpDate = tokenExpDate.AddSeconds(tokenExpInt);

            // TODO:
            // if the token is about to expire, send back a new signed token
            // else, return back the old JWT
            // in the later stage, we need to blacklist old jti before sending a new one.
            return Ok(new
            {
                token = accessToken,
                expiration = tokenExpDate
            });
        }
    }
}
