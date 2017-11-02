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
                return
                    BadRequest(new
                        {
                            status = false,
                            messages = messages
                        });
            }

            IdentityResult result = await _authService.CreateUser(userDTO);

            if (!result.Succeeded)
            {
                var messages = result.Errors.Select(x => x.Description).ToList();
                return
                    BadRequest(new
                        {
                            status = false,
                            messages = messages
                        });
            }


            return Ok(new
                    {
                        status = true,
                        messages = new List<string>() { "User has been created. Please check your mailbox to verify your registration." }
                    });
        }

        [HttpGet("[action]")]
        public RedirectResult VerifyEmail(string userid, string token)
        {
            bool result = _authService.VerifyEmail(userid, token);
            var siteUrl = _appConfiguration.Value.SiteUrl;

            if (result) {
                return Redirect($"{siteUrl}/email/success");
            }
            else {
                return Redirect($"{siteUrl}/email/failure");
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ResendEmail([FromBody] ApplicationUserDTO userDTO)
        {
            try{
                await _authService.ResendVerificationEmail(userDTO);
            }
            catch(ASUserNotFoundException ex)
            {
                _logger.LogDebug("User was not found while calling resendverificationEmail method. " + ex.Message);
                return badRequestHelper("Email account does not exist.");
            }
            catch(ASEmailAlreadyVerifiedException ex)
            {
                _logger.LogDebug("User has already verified the account. There is no need to resend the verification email. " + ex.Message);
                return badRequestHelper("Email already has been verified.");
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
                return
                    BadRequest(new
                        {
                            status = false,
                            messages = messages
                        });
            }

            string encodedToken = "";
            try
            {
                await _authService.VerifyUser(userDTO);
                encodedToken = await _authService.GetToken(userDTO);
            }
            catch (ASEmailVerificationFailureException ex)
            {
                _logger.LogDebug(ex.Message);
                return badRequestHelper("Login failed. Your account has not been verified. Please check your email account to verify your registration.");
            }
            catch(ASPasswordNotCorrectException ex) 
            {
                _logger.LogDebug(ex.Message);
                return badRequestHelper("Login failed. Password does not match.");
            }
            catch(ASUserNotFoundException ex)
            {
                _logger.LogDebug(ex.Message);
                return badRequestHelper("Login failed. Your account was not found.");
            }
            catch (Exception ex) 
            { 
                _logger.LogDebug(ex.Message);
            }

            return okRequestHelper("Token has been generated", encodedToken);
        }

        [Authorize]
        [HttpPost("[action]")]
        public IActionResult Validate()
        {   
            return Ok(new
            {
                status = true,
                messages = new List<string>() { "Token validated" }
            });
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Refresh()
        {   
            var authenticateInfo = await HttpContext.Authentication.GetAuthenticateInfoAsync("Bearer");
            string encodedToken = authenticateInfo.Properties.Items[".Token.access_token"];

            if (_authService.IsTokenBlacklisted(encodedToken))
            {
                return badRequestHelper("This token cannot be used to obtain a new JWT", encodedToken);
            }

            string newToken = await _authService.RefreshToken(encodedToken);
            return okRequestHelper("New token has been generated.", newToken);
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
