using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace app.DataLayer.Models
{
    public interface IJtiDAO
    {
        Task<Jti> Create(string uuid, string sub, DateTime exp);
        Jti Read(string uuid);
    }
    public class JtiDAO : IJtiDAO
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger _logger;

        public JtiDAO(ApplicationContext dbContext, ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _logger = loggerFactory.CreateLogger<JtiDAO>();
        }

        public async Task<Jti> Create(string uuid, string sub, DateTime exp)
        {   
            Jti jtiEntity = null;
            try 
            {
                jtiEntity = new Jti()
                                {
                                    Uuid = uuid,
                                    Sub = sub,
                                    ExpiryTime = exp
                                };
                await _dbContext.Jtis.AddAsync(jtiEntity);
                await _dbContext.SaveChangesAsync();
            }

            catch (TimeoutException ex)
            {
                _logger.LogDebug("Database operation was timed out while creating a JTI entity." + ex.Message);
                throw new JtiDaoException("Database operation was timed out while creating a JTI entity.", ex);
            }
            catch (Exception ex) when (ex is DbUpdateException || ex is ObjectDisposedException)
            {
                _logger.LogDebug("Database was not updated while creating a JTI entity." + ex.Message);
                throw new JtiDaoException("Database was not updated while creating a JTI entity.", ex);
            }
            catch (Exception ex) 
            { 
                _logger.LogDebug("Unknown exception happened while accessing dbcontext from JTI DAO Create method." + ex.Message);
                throw;
            }

            return jtiEntity;
        }

        public Jti Read(string uuid)
        {   
            Jti jtiEntity = null;

            try
            {
                jtiEntity = _dbContext.Jtis.FirstOrDefault(x => x.Uuid == uuid);
            }

            catch (TimeoutException ex)
            {
                _logger.LogDebug("Database operation was timed out while reading a JTI entity." + ex.Message);
                throw new JtiDaoException("Database operation was timed out while reading a JTI entity.", ex);
            }
            catch (Exception ex) when (ex is DbUpdateException || ex is ObjectDisposedException)
            {
                _logger.LogDebug("Database was not updated while reading a JTI entity." + ex.Message);
                throw new JtiDaoException("Database was not updated while reading a JTI entity.", ex);
            }
            catch (Exception ex) 
            { 
                _logger.LogDebug("Unknown exception happened while accessing dbcontext from JTI DAO Read method." + ex.Message);
                throw;
            }

            return jtiEntity;
        }
    }
}