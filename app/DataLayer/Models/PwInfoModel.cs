using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace app.DataLayer.Models
{
    public class PwInfo
    {
        public int Id { get; set; }
        public string Domain { get; set; }
        public string Password { get; set; }
    }
}