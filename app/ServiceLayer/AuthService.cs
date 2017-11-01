using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.WebUtilities;

using app.DataLayer.Models;


namespace app.ServiceLayer
{
    public interface IAuthService
    {
        Task<IdentityResult> CreateUser(ApplicationUserDTO userDTO);
        bool VerifyEmail(string userid, string token);
        Task<bool> VerifyUser(ApplicationUserDTO userDTO);
        Task<string> GetToken(ApplicationUserDTO userDTO);
        Task<string> RefreshToken(string token);
        bool IsTokenBlacklisted(string token);
        string ExtractUserEmail(string token);
    }

	public class AuthService : IAuthService
    {
        private readonly ILogger _logger;
        private readonly IEmailSender _emailSender;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;
        private readonly IOptions<AppConfiguration> _appConfiguration;
        private readonly IJtiDAO _jtiDAO;
        private readonly IDataDAO _dataDAO;


        public AuthService(
            ILoggerFactory loggerFactory,
            IEmailSender emailSender,
            UserManager<ApplicationUser> userManager,
            IPasswordHasher<ApplicationUser> passwordHasher,
            IOptions<AppConfiguration> appConfiguration,
            IJtiDAO jtiDAO,
            IDataDAO dataDAO
            )
        {
            _emailSender = emailSender;
            _userManager = userManager;
            _passwordHasher = passwordHasher;
            _appConfiguration = appConfiguration;
            _logger = loggerFactory.CreateLogger<AuthService>();
            _jtiDAO = jtiDAO;
            _dataDAO = dataDAO;
        }

        public async Task<IdentityResult> CreateUser(ApplicationUserDTO userDTO)
        {
            var user = new ApplicationUser(){ UserName = userDTO.Email, Email = userDTO.Email };
            var result = await _userManager.CreateAsync(user, userDTO.Password);

            if (result.Succeeded)
            {
                // create a default data model for the user
                Data data = await _dataDAO.Create(userDTO.Email, "");

                // send verification email
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var parameters = new Dictionary<string,string>{
                    {"userid", user.Id},
                    {"token", token}
                };

                var address = _appConfiguration.Value.SiteUrl;
                var callbackUrl = $"{address}/api/account/verifyemail";
                var encodedUrl = QueryHelpers.AddQueryString(callbackUrl, parameters);

                Console.WriteLine(user.Id);
                Console.WriteLine(token);
                Console.WriteLine(encodedUrl);

                await _emailSender.SendEmailAsync(userDTO.Email, "Confirm your account",
                            $"Please confirm your account by clicking this link:  {encodedUrl}");
            }

            return result;
        }

        public bool VerifyEmail(string userid, string token)
        {
            var user = _userManager.FindByIdAsync(userid).Result;
            IdentityResult result = _userManager.ConfirmEmailAsync(user,token).Result;

            return result.Succeeded;
        }

        public async Task<bool> VerifyUser(ApplicationUserDTO userDTO)
        {
            var user = await _userManager.FindByNameAsync(userDTO.Email);

            return (user != null && 
            (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userDTO.Password) == PasswordVerificationResult.Success) &&
            await _userManager.IsEmailConfirmedAsync(user));
        }

        public async Task<string> GetToken(ApplicationUserDTO userDTO)
        {
            var user = await _userManager.FindByNameAsync(userDTO.Email);
            var token = await GetJwtSecurityToken(user);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> RefreshToken(string encodedToken)
        {
            // blacklist old JTI
            await BlacklistJTI(encodedToken);

            // generate new JWT
            string sub = GetClaimValueFromToken(encodedToken, "sub");
            ApplicationUser user = await _userManager.FindByNameAsync(sub);
            JwtSecurityToken newToken = await GetJwtSecurityToken(user);

            return new JwtSecurityTokenHandler().WriteToken(newToken);
        }

        // returns true, if the token is blacklisted
        public bool IsTokenBlacklisted(string encodedToken)
        {
            string uuid = GetClaimValueFromToken(encodedToken, "jti");
            return _jtiDAO.IsTokenBlacklisted(uuid);
        }

        public string ExtractUserEmail(string token)
        {
            string userEmail = GetClaimValueFromToken(token, "sub");

            return userEmail;
        }

        // generates a JWT for an user
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

        // adds additional claims to the JWT
        private static IEnumerable<Claim> GetTokenClaims(ApplicationUser user)
        {
            return new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName)
            };
        }

        private async Task BlacklistJTI(string encodedToken)
        {
            // blacklist old JTI
            string uuid = GetClaimValueFromToken(encodedToken, "jti");
            string exp = GetClaimValueFromToken(encodedToken, "exp");
            string sub = GetClaimValueFromToken(encodedToken, "sub");
            int tokenExpInt = Int32.Parse(exp);
            DateTime tokenExpDate = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            tokenExpDate = tokenExpDate.AddSeconds(tokenExpInt);

            await _jtiDAO.Create(uuid, sub, tokenExpDate);
        }

        private string GetClaimValueFromToken(string encodedToken, string type)
        {
            JwtSecurityToken token = (JwtSecurityToken) new JwtSecurityTokenHandler().ReadToken(encodedToken);

            // blacklist the old JTI
            Claim targetClaim = (from Claim claim in token.Claims
                              where claim.Type == type
                              select claim).First();

            return targetClaim.Value;
        }
    }
}