using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace app.DataLayer.Models
{
    public interface IDataDAO
    {
        // Task Create(string userId);
        // Task Read(string userId);
        // Task Update(string userId, string userData);
        // Task Delete(string userId);
    }
    public class DataDAO : IDataDAO
    {
        private readonly ApplicationContext _dbContext;

        public DataDAO(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        // public bool IsTokenBlacklisted(string uuid)
        // {
        //     var jtiEntity = _dbContext.Jtis.FirstOrDefault(x => x.Uuid == uuid);
        //     return jtiEntity != null;
        // }
    }
}