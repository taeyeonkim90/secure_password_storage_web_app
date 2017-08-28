using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace app.DataLayer.Models
{
    public interface IJtiDAO
    {
        Task Create(string uuid, string sub, DateTime exp);
        bool IsTokenBlacklisted(string uuid);
    }
    public class JtiDAO : IJtiDAO
    {
        private readonly ApplicationContext _dbContext;

        public JtiDAO(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Create(string uuid, string sub, DateTime exp)
        {
            Jti jtiModel = new Jti()
                            {
                                Uuid = uuid,
                                Sub = sub,
                                ExpiryTime = exp
                            };
            await _dbContext.Jtis.AddAsync(jtiModel);
            await _dbContext.SaveChangesAsync();
        }

        public bool IsTokenBlacklisted(string uuid)
        {
            var jtiEntity = _dbContext.Jtis.FirstOrDefault(x => x.Uuid == uuid);
            return jtiEntity != null;
        }
    }
}