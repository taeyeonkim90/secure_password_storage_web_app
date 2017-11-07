using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using app.DataLayer.Models;
using app.ServiceLayer;


namespace app.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly ILogger _logger;
        private readonly IAuthService _authService;
        private readonly IOptions<AppConfiguration> _appConfiguration;

        public AccountController(
            ILoggerFactory loggerFactory,
            IOptions<AppConfiguration> appConfiguration,
            IAuthService authService)
        {
            _logger = loggerFactory.CreateLogger<AccountController>();
            _appConfiguration = appConfiguration;
            _authService = authService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] ApplicationUserDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                var messages = ModelState.Values.SelectMany(v => v.Errors)
                            .Select(modelError => modelError.ErrorMessage)
                            .ToList();
                return badRequestHelper(messages);
            }

            try
            {
                IdentityResult result = await _authService.CreateUser(userDTO);
                if (!result.Succeeded)
                {
                    var messages = result.Errors.Select(x => x.Description).ToList();
                    return badRequestHelper(messages);
                }
            }

            catch (AuthServiceException ex)
            {
                if (ex.InnerException == null)
                    _logger.LogDebug(ex.Message);
                return badRequestHelper("There was an error while creating the user account.");
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Unknown exception occured." + ex.Message);
                throw;
            }

            return okRequestHelper("User has been created. Please check your mailbox to verify your registration.");
        }

        [HttpGet("[action]")]
        public RedirectResult VerifyEmail(string userid, string token)
        {
            var siteUrl = _appConfiguration.Value.SiteUrl;
            try
            {
                if (! _authService.VerifyEmailToken(userid, token))
                    return Redirect($"{siteUrl}/email/failure");
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Unknown exception occured." + ex.Message);
                throw;
            }

            return Redirect($"{siteUrl}/email/success");
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ResendEmail([FromBody] ApplicationUserDTO userDTO)
        {
            try
            {
                if (!await _authService.isAccountPresent(userDTO))
                    return badRequestHelper("Email account does not exist.");
                if (await _authService.isEmailVerified(userDTO))
                    return badRequestHelper("Email account already has been verified.");
                await _authService.SendVerificationEmail(userDTO);
            }
            
            catch (Exception ex)
            {
                _logger.LogDebug("Unknown exception occured." + ex.Message);
                throw;
            }

            return okRequestHelper("Verification email has been resent.");
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Token([FromBody] ApplicationUserDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                var messages = ModelState.Values.SelectMany(v => v.Errors)
                            .Select(modelError => modelError.ErrorMessage)
                            .ToList();
                return badRequestHelper(messages);
            }

            string encodedToken = "";
            try
            {
                if (!await _authService.isAccountPresent(userDTO))
                    return badRequestHelper("Email account does not exist.");
                if (!await _authService.isPasswordCorrect(userDTO))
                    return badRequestHelper("Provided password was incorrect.");
                if (!await _authService.isEmailVerified(userDTO))
                    return badRequestHelper("You have not yet verified your email. Please check your mail box.");
    
                encodedToken = await _authService.GetToken(userDTO);
            }
            catch (Exception ex) 
            { 
                _logger.LogDebug("Unknown exception occured." + ex.Message);
                throw;
            }

            return okRequestHelper("Token has been generated", encodedToken);
        }

        [Authorize]
        [HttpPost("[action]")]
        public IActionResult Validate()
        {   
            return okRequestHelper("Token is validated");
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Refresh()
        {   
            var authenticateInfo = await HttpContext.Authentication.GetAuthenticateInfoAsync("Bearer");
            if (authenticateInfo.Properties.Items.ContainsKey(".Token.access_token"))
            {
                string encodedToken = authenticateInfo.Properties.Items[".Token.access_token"];

                if (_authService.IsTokenBlacklisted(encodedToken))
                    return badRequestHelper("This token cannot be used to obtain a new JWT", encodedToken);

                string newToken = await _authService.RefreshToken(encodedToken);
                return okRequestHelper("New token has been generated.", newToken);
            }

            return badRequestHelper("Token was not provided.", "");
        }

        private IActionResult badRequestHelper(List<string> messages, string token="")
        {
            return BadRequest(new
                {
                    status = false,
                    messages = messages,
                    token  = token
                });
        }

        private IActionResult badRequestHelper(string message, string token="")
        {
            return BadRequest(new
                {
                    status = false,
                    messages = new List<string>() { message },
                    token = token
                });
        }
        private IActionResult okRequestHelper(List<string> messages, string token="")
        {
            return Ok(new
                {
                    status = true,
                    messages = messages,
                    token = token
                });
        }

        private IActionResult okRequestHelper(string message, string token="")
        {
            return Ok(new
                {
                    status = true,
                    messages = new List<string>() { message },
                    token = token
                });
        }
    }
}
