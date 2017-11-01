using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

using app.DataLayer.Models;
using app.ServiceLayer;


namespace app.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly ILogger _logger;
        private readonly IAuthService _authService;

        public AccountController(
            ILoggerFactory loggerFactory,
            IAuthService authService)
        {
            _logger = loggerFactory.CreateLogger<AccountController>();
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
        public IActionResult VerifyEmail(string userid, string token)
        {
            bool result = _authService.VerifyEmail(userid, token);

            if (result) {
                return Ok(new
                    {
                        status = true,
                        messages = new List<string>() { "Email has been verified." }
                    });
            }
            else {
                return BadRequest(new
                    {
                        status = false,
                        messages = new List<string>() { "Email address verification failed." }
                    });
            }
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
