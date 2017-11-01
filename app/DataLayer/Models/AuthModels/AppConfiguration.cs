using System.Collections.Generic;

namespace app.DataLayer.Models
{
    public class AppConfiguration
    {
        public string SiteTitle { get; set; }
        public string SiteUrl { get; set; }
        public string Key { get; set; }
        public string SendGridKey { get; set; }
    }
}
