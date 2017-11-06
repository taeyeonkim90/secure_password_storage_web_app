using System;


namespace app.DataLayer{    
    public class DaoException: Exception
    {
        public DaoException() {}

        public DaoException(string message) : base(message) {}

        public DaoException(string message, Exception inner) : base(message, inner) {}
    }

    public class JtiDaoException: DaoException
    {
        public JtiDaoException() {}

        public JtiDaoException(string message) : base(message) {}

        public JtiDaoException(string message, Exception inner) : base(message, inner) {}
    }

    public class DataDaoException: DaoException
    {
        public DataDaoException() {}

        public DataDaoException(string message) : base(message) {}

        public DataDaoException(string message, Exception inner) : base(message, inner) {}
    }
}