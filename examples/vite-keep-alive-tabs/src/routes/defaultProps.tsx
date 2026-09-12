import {
  ChromeFilled,
  CrownFilled,
  SmileFilled,
  TabletFilled,
} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    name: 'Home',
    routes: [
      {
        path: '/',
        name: 'Home',
        icon: <SmileFilled />,
      },
      {
        path: '/demo',
        name: 'Demo',
        icon: <CrownFilled />,
      },
      {
        name: 'Blogs',
        icon: <TabletFilled />,
        path: '/blogs',
        routes: [
          {
            name: 'Blogs 1',
            path: '/blogs/1',
          },
          {
            name: 'Blogs 2',
            path: '/blogs/2',
          },
          {
            name: 'Blogs 3',
            path: '/blogs/3',
          },
          {
            name: 'Blogs 4',
            path: '/blogs/4',
          },
          {
            name: 'Blogs 5',
            path: '/blogs/5',
          },
        ],
      },
      {
        path: '/about',
        name: 'About',
        icon: <ChromeFilled />,
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      title: 'fs-router',
      desc: '文件路由项目文档',
      url: 'https://givingwu.github.io/fs-router/',
    },
    {
      title: 'React Router',
      desc: '公开上游文档',
      url: 'https://reactrouter.com/',
    },
  ],
};
