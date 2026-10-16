import express from 'express'
import cookieParser from 'cookie-parser';
import AuthRoute from './router/auth';
import UserRoute from './router/profile';
import ChannelRoute from './router/channel'


const app = express();

app.use(express.json())
app.use(cookieParser());

app.use('/auth', AuthRoute);
app.use('/yt/user', UserRoute);
app.use('/channel', ChannelRoute)

app.listen(3000, () => {
    console.log(`Server is running on - http://localhost:3000`);
})