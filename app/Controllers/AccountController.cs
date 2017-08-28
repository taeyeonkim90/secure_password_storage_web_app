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
        public async Task<IActionResult> Create(ApplicationUserDTO userDTO)
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
        public async Task<IActionResult> Token(ApplicationUserDTO userDTO)
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
                    token = encodedToken,
                    message = "This token cannot be used to obtain a new JWT"
                });
            }

            string newToken = await _authService.RefreshToken(encodedToken);
            return Ok(new
            {
                status = true,
                token = newToken
            });
        }

        // ******TODO: LEAVE THIS PART FOR A REFERENCE FOR NOW********
        // [Authorize]
        // [HttpPost("[action]")]
        // public async Task<IActionResult> Refresh()
        // {   
        //     // parse token information
        //     var authenticateInfo = await HttpContext.Authentication.GetAuthenticateInfoAsync("Bearer");
        //     string accessToken = authenticateInfo.Properties.Items[".Token.access_token"];
        //     string userId = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        //     string jti = this.User.FindFirstValue("jit");
        //     string tokenExp = this.User.FindFirstValue("exp");

        //     _logger.LogInformation($"JWT : {accessToken}");
        //     _logger.LogInformation($"UserId: {userId}");
        //     _logger.LogInformation($"JTI: {jti}");
        //     _logger.LogInformation($"Expiration: {tokenExp}");

        //     // convert Unix Timestamp to DateTime object
        //     int tokenExpInt = Int32.Parse(tokenExp);
        //     DateTime tokenExpDate = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
        //     tokenExpDate = tokenExpDate.AddSeconds(tokenExpInt);

        //     // TODO:
        //     // if the token is about to expire, send back a new signed token
        //     // else, return back the old JWT
        //     // in the later stage, we need to blacklist old jti before sending a new one.
        //     return Ok(new
        //     {
        //         token = accessToken,
        //         expiration = tokenExpDate
        //     });
        // }
    }
}
