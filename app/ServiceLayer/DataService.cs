using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

using app.DataLayer.Models;
using app.DataLayer;


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
            Data data = null;
            try
            {
                data = await _dataDAO.Read(userEmail);
            }
            catch (DaoException ex) 
            {
                if(ex.InnerException == null) 
                    _logger.LogDebug("Could not receive user's data from the database." + ex.Message);
                throw new DataServiceException("Could not receive user's data from the database.",ex);
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Could not receive user's data from the database." + ex.Message);
                throw;
            }
            return new DataDTO(){ UserData = data.UserData };
        }

        public async Task<DataDTO> UpdateUserData(string userEmail, string userData)
        {
            Data data = null;
            try
            {
                data = await _dataDAO.Update(userEmail, userData);
            }
            catch (DaoException ex) 
            {
                if(ex.InnerException == null) 
                    _logger.LogDebug("Could not receive user's data from the database." + ex.Message);
                throw new DataServiceException("Could not receive user's data from the database.",ex);
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Could not receive user's data from the database." + ex.Message);
                throw;
            }

            return new DataDTO(){ UserData = data.UserData };
        }
    }
}