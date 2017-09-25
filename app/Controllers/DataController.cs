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
        [HttpGet("[action]")]
        public async Task<IActionResult> Card()
        {
            string userEmail = await GetEmailFromToken();
            DataDTO data = await _dataService.ReadUserData(userEmail);

            return Ok(new
            {
                status = true,
                message = new List<string>() { "Data retrieved" },
                data = data
            });

        } 

        // Update
        [HttpPut("[action]")]
        public async Task<IActionResult> Card([FromBody] DataDTO newData)
        {
            string userEmail = await GetEmailFromToken();
            DataDTO updatedData = await _dataService.UpdateUserData(userEmail, newData.UserData);

            return Ok(new
            {
                status = true,
                message = new List<string>() { "Data updated" },
                data = updatedData
            });
        } 

        private async Task<string> GetEmailFromToken()
        {
            var authenticateInfo = await HttpContext.Authentication.GetAuthenticateInfoAsync("Bearer");
            string encodedToken = authenticateInfo.Properties.Items[".Token.access_token"];

            return _authService.ExtractUserEmail(encodedToken);
        }
    }
}
