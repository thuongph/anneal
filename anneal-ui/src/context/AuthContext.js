import { useState, useContext, createContext } from "react";
import { Spin, Button, Form, Input } from 'antd';
import { getUser } from "../api/userService";
import { useNavigate } from "react-router-dom";
import { setWithExpiry, getWithExpiry } from "../helpers/localStorage";

const USER_NAME_LS_KEY = 'username';
const ACCESS_TOKEN_LS_KEY = 'accesstoken';
const expire = 1000 * 60 * 60 * 48;

const AuthContext = createContext({
    loading: false,
    user: null,
});

const getUserInfoFromLS = () => {
    const name = getWithExpiry(USER_NAME_LS_KEY);
    const accessToken = getWithExpiry(ACCESS_TOKEN_LS_KEY);
    if (!!name && !!accessToken) {
        return {name: name, accessToken: accessToken};
    } else {
        return null;
    }
}

export const Login = (props) => {
    const { setLoading, setUser } = props;
    const navigate = useNavigate();
    const getUserInfo = async (_user) => {
        try {
            setLoading(true);
            const user = await getUser(_user);
            setWithExpiry(USER_NAME_LS_KEY, user.user.name, expire);
            setWithExpiry(ACCESS_TOKEN_LS_KEY, user.token, expire);
            setUser({name: user.user.name, accessToken: user.token});
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    const onFinish = async (values) => {
        await getUserInfo(values);
        navigate('/projects');
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '20%',
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
            label="Tên đăng nhập"
            name="name"
            rules={[
                {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập',
                },
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
                {
                required: true,
                message: 'Vui lòng nhập mật khẩu',
                },
            ]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
            }}
            >
            <Button type="primary" htmlType="submit">
                Đăng nhập
            </Button>
            </Form.Item>
        </Form>
    );
}

export const AuthProvider = ({children}) => {
    const [isLoading, setLoading]  = useState(false);
    const [user, setUser] = useState(getUserInfoFromLS());

    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
                <AuthContext.Provider value={{isLoading: isLoading, user: user}} >
                    {
                        !!user ? children : (
                            <div>
                                <Login setLoading={setLoading} setUser={setUser} />
                            </div>
                        )
                    }
                </AuthContext.Provider>
        </Spin>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};