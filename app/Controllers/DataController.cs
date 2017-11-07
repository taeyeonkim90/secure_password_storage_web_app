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
    public class DataController : Controller
    {
        private readonly ILogger _logger;
        private readonly IAuthService _authService;
        private readonly IDataService _dataService;

        public DataController(
            ILoggerFactory loggerFactory,
            IAuthService authService,
            IDataService dataService)
        {
            _logger = loggerFactory.CreateLogger<DataController>();
            _authService = authService;
            _dataService = dataService;
        }

        // Read
        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> Card()
        {
            try
            {
                string userEmail = await GetEmailFromToken();
                DataDTO data = await _dataService.ReadUserData(userEmail);
                return okRequestHelper("Data retrieved", data);
            }

            catch (DataServiceException ex)
            {
                if (ex.InnerException == null)
                    _logger.LogDebug(ex.Message);
                return badRequestHelper("Could not access the user data from the database.");
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Unknown exception occurred." + ex.Message);
                throw;
            }
        } 

        // Update
        [Authorize]
        [HttpPut("[action]")]
        public async Task<IActionResult> Card([FromBody] DataDTO newData)
        {
            try
            {
                string userEmail = await GetEmailFromToken();
                DataDTO updatedData = await _dataService.UpdateUserData(userEmail, newData.UserData);

                return okRequestHelper("Data updated", updatedData);
            }

            catch (DataServiceException ex)
            {
                if (ex.InnerException == null)
                    _logger.LogDebug(ex.Message);
                return badRequestHelper("Could not update the user data from the database.");
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Unknown exception occurred." + ex.Message);
                throw;
            }
        } 

        private async Task<string> GetEmailFromToken()
        {
            var authenticateInfo = await HttpContext.Authentication.GetAuthenticateInfoAsync("Bearer");
            string encodedToken = authenticateInfo.Properties.Items[".Token.access_token"];

            return _authService.ExtractUserEmail(encodedToken);
        }

        private IActionResult badRequestHelper(List<string> messages, DataDTO data=null)
        {
            return BadRequest(new
                {
                    status = false,
                    messages = messages,
                    data  = data
                });
        }

        private IActionResult badRequestHelper(string message, DataDTO data=null)
        {
            return BadRequest(new
                {
                    status = false,
                    messages = new List<string>() { message },
                    data = data
                });
        }
        private IActionResult okRequestHelper(List<string> messages, DataDTO data=null)
        {
            return Ok(new
                {
                    status = true,
                    messages = messages,
                    data = data
                });
        }

        private IActionResult okRequestHelper(string message, DataDTO data=null)
        {
            return Ok(new
                {
                    status = true,
                    messages = new List<string>() { message },
                    data = data
                });
        }
    }
}
