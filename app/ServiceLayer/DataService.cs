using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

using app.DataLayer.Models;


namespace app.ServiceLayer
{
    public interface IDataService
    {
        Task<DataDTO> ReadUserData(string userEmail);        
        Task<DataDTO> UpdateUserData(string userEmail, string userData);
    }

	public class DataService : IDataService
    {
        private readonly ILogger _logger;
        private readonly IDataDAO _dataDAO;


        public DataService(
            ApplicationContext dbContext,
            ILoggerFactory loggerFactory,
            IDataDAO dataDAO
            )
        {
            _logger = loggerFactory.CreateLogger<DataService>();
            _dataDAO = dataDAO;
        }

        public async Task<DataDTO> ReadUserData(string userEmail)
        {
            Data data = await _dataDAO.Read(userEmail);

            return new DataDTO{ UserData = data.UserData };
        }

        public async Task<DataDTO> UpdateUserData(string userEmail, string userData)
        {
            Data data = await _dataDAO.Update(userEmail, userData);

            return new DataDTO{ UserData = data.UserData };
        }
    }
}