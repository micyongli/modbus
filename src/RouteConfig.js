

export function getTitleByPath(pathname) {
    return routeMap[pathname];
}

const routeMap = {
    '/h/register': '设备注册',
    '/h/user': '用户信息',
    '/h': '上线日志'
};