import { IconButton } from '@material-tailwind/react';
import classnames from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { IoIosAnalytics, IoIosApps, IoIosKeypad, IoIosPulse, IoIosThunderstorm, IoIosUnlock } from 'react-icons/io';
import { Outlet } from 'react-router-dom';

export interface AdminLayoutProps extends HTMLAttributes<HTMLElement> {}

const AdminLayout: FC<AdminLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={classnames('flex', className)}>
      <aside className="fixed top-0 left-0 w-[50px] h-screen max-h-screen bg-[#84848C] flex items-center text-white flex-col p-2 space-y-2">
        <IconButton variant="filled" className="text-neutral-700">
          <IoIosPulse size={24} />
        </IconButton>
        <IconButton variant="text" className="text-neutral-700">
          <IoIosThunderstorm size={24} />
        </IconButton>
        <IconButton variant="text" className="text-neutral-700">
          <IoIosApps size={24} />
        </IconButton>
        <IconButton variant="text" className="text-neutral-700">
          <IoIosKeypad size={24} />
        </IconButton>
        <IconButton variant="text" className="text-neutral-700">
          <IoIosAnalytics size={24} />
        </IconButton>
        <IconButton variant="text" className="text-neutral-700">
          <IoIosUnlock size={24} />
        </IconButton>
      </aside>
      <main className="w-full flex-1 bg-white ml-[50px] min-h-screen">
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default AdminLayout;
