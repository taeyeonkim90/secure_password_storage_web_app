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
        public IActionResult Test()
        {   
            _logger.LogInformation($"UserId: {this.User.FindFirst(ClaimTypes.NameIdentifier).Value}");

            int one = 1;

            return Ok(new{
                result = one
            });
        }
    }
}
