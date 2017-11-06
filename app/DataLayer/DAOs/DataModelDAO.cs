using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace app.DataLayer.Models
{
    public interface IDataDAO
    {
        Task<Data> Create(string userEmail, string userData="");
        Task<Data> Read(string userEmail);
        Task<Data> Update(string userEmail, string userData);
        // Task Delete(string userId);
    }
    public class DataDAO : IDataDAO
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger _logger;

        public DataDAO(ApplicationContext dbContext, ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _logger = loggerFactory.CreateLogger<DataDAO>();
        }

        public async Task<Data> Create(string userEmail, string userData)
        {
            Data newData = null;
            try{
                ApplicationUser user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == userEmail);

                if (user == null)
                    throw new DataDaoException($"User with email address({userEmail} was not found.)"); 

                DateTime currentTime = DateTime.Now;
                newData = new Data(){
                                UserData = userData,
                                Created = currentTime,
                                LastModified = currentTime,
                                User = user
                                };
                await _dbContext.Datas.AddAsync(newData);
                await _dbContext.SaveChangesAsync();
            }

            catch (TimeoutException ex)
            {
                _logger.LogDebug("Database operation was timed out." + ex.Message);
                throw new DataDaoException("Database operation was timed out.", ex);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogDebug("Database was not updated while creating a Data entity." + ex.Message);
                throw new DataDaoException("Database was not updated while creating a Data entity.", ex);
            }
            catch (Exception ex) 
            {
                _logger.LogDebug("Unknown exception happened while accessing dbcontext from DAO Create method" + ex.Message);
                throw new DataDaoException("Unknown exception happened while accessing dbcontext from DAO Create method", ex);
            }

            return newData;
        }

        public async Task<Data> Read(string userEmail)
        {
            Data data = null;
            try
            {
                data = await _dbContext.Datas.Include(d => d.User).FirstOrDefaultAsync(d => d.User.Email == userEmail);
            }
            
            catch (TimeoutException ex)
            {
                _logger.LogDebug("Database operation was timed out." + ex.Message);
                throw new DataDaoException("Database operation was timed out.", ex);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogDebug("Database was not updated while reading a Data entity." + ex.Message);
                throw new DataDaoException("Database was not updated while reading a Data entity.", ex);
            }
            catch (Exception ex) 
            { 
                _logger.LogDebug("Unknown exception happened while accessing dbcontext from DAO Read method" + ex.Message);
                throw new DataDaoException("Unknown exception happened while accessing dbcontext from DAO Read method", ex);
            }

            return data;
        }

        public async Task<Data> Update(string userEmail, string userData)
        {
            Data data = null;
            try
            {
                data = await _dbContext.Datas.Include(d => d.User).FirstOrDefaultAsync(d => d.User.Email == userEmail);
                data.UserData = userData;
                data.LastModified = DateTime.Now;

                _dbContext.Entry(data).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
            }

            catch (TimeoutException ex)
            {
                _logger.LogDebug("Database operation was timed out." + ex.Message);
                throw new DataDaoException("Database operation was timed out.", ex);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogDebug("Database was not updated while updating a Data entity." + ex.Message);
                throw new DataDaoException("Database was not updated while updating a Data entity.", ex);
            }
            catch (Exception ex) 
            { 
                _logger.LogDebug("Unknown exception happened while accessing dbcontext from DAO Update method" + ex.Message);
                throw new DataDaoException("Unknown exception happened while accessing dbcontext from DAO Update method", ex);
            }

            return data;
        }
    }
}