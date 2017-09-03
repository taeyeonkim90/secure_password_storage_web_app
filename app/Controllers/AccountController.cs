using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

using app.DataLayer.Models;
using app.ServiceLayer;


namespace app.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IAuthService _authService;

        public AccountController(
            IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] ApplicationUserDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                var message = ModelState.Values.SelectMany(v => v.Errors)
                            .Select(modelError => modelError.ErrorMessage)
                            .ToList();
                return
                    BadRequest(new
                        {
                            status = false,
                            message = message
                        });
            }

            IdentityResult result = await _authService.CreateUser(userDTO);

            if (!result.Succeeded)
            {
                var message = result.Errors.Select(x => x.Description).ToList();
                return
                    BadRequest(new
                        {
                            status = false,
                            message = message
                        });
            }

            return Ok(new
                    {
                        status = true,
                        message = "User has been created"
                    });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Token([FromBody] ApplicationUserDTO userDTO)
        {
            if (!ModelState.IsValid){
                var message = ModelState.Values.SelectMany(v => v.Errors)
                            .Select(modelError => modelError.ErrorMessage)
                            .ToList();
                return
                    BadRequest(new
                        {
                            status = false,
                            message = message
                        });
            }

            bool result = await _authService.VerifyUser(userDTO);
            if (result)
            {
                var encodedToken = await _authService.GetToken(userDTO);
                return Ok(new
                {
                    status = true,
                    message = "Token has been generated",
                    token = encodedToken
                });
            }

            return BadRequest();
        }

        [Authorize]
        [HttpPost("[action]")]
        public IActionResult Validate()
        {   
            return Ok(new
            {
                status = true,
                message = "Token validated"
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
                    message = "This token cannot be used to obtain a new JWT",
                    token = encodedToken
                });
            }

            string newToken = await _authService.RefreshToken(encodedToken);
            return Ok(new
            {
                status = true,
                message = "New token has been generated",
                token = newToken
            });
        }
    }
}
