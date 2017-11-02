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
            await _authService.ResendVerificationEmail(userDTO);

            return Ok(new
                {
                    status = true,
                    messages = new List<string>() { "Verification email has been resent." }
                });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Token([FromBody] ApplicationUserDTO userDTO)
        {
            if (!ModelState.IsValid){
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

            bool result = await _authService.VerifyUser(userDTO);
            if (result)
            {
                var encodedToken = await _authService.GetToken(userDTO);
                return Ok(new
                {
                    status = true,
                    messages = new List<string>() { "Token has been generated" },
                    token = encodedToken
                });
            }

            return BadRequest(new
                {
                    status = false,
                    messages = new List<string>() { "Log in failed" }
                });
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
                return BadRequest(new
                {
                    status = false,
                    messages = new List<string>() { "This token cannot be used to obtain a new JWT" },
                    token = encodedToken
                });
            }

            string newToken = await _authService.RefreshToken(encodedToken);
            return Ok(new
            {
                status = true,
                messages = new List<string>() { "New token has been generated" },
                token = newToken
            });
        }
    }
}
