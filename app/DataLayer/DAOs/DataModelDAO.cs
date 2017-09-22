using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace app.DataLayer.Models
{
    public interface IDataDAO
    {
        Task<Data> Create(string userId, string userData="");
        Task<Data> Read(string userId);
        Task<Data> Update(string userId, string userData);
        // Task Delete(string userId);
    }
    public class DataDAO : IDataDAO
    {
        private readonly ApplicationContext _dbContext;

        public DataDAO(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Data> Create(string userEmail, string userData="default data")
        {
            ApplicationUser user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == userEmail);

            DateTime currentTime = DateTime.Now;
            Data newData = new Data {
                                UserData = userData,
                                Created = currentTime,
                                LastModified = currentTime,
                                User = user
            };
            await _dbContext.Datas.AddAsync(newData);
            await _dbContext.SaveChangesAsync();

            return newData;
        }

        public async Task<Data> Read(string userEmail)
        {
            Data data = await _dbContext.Datas.FirstOrDefaultAsync(x => x.UserForeignKey == userEmail);

            return data;
        }

        public async Task<Data> Update(string userEmail, string userData)
        {
            Data data = await _dbContext.Datas.FirstOrDefaultAsync(x => x.UserForeignKey == userEmail);
            data.UserData = userData;
            data.LastModified = DateTime.Now;
            
            await _dbContext.Datas.AddAsync(data);
            await _dbContext.SaveChangesAsync();

            return data;
        }
    }
}