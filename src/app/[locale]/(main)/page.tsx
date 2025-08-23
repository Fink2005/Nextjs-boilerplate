import { Header } from '@/components/header-footer/Header';

const page = () => {
  // const headersList = await headers();
  // const pathName = headersList.get('x-pathname');
  // console.log(pathName);
  return (
    <div className="bg-9x9 flex flex-col items-center h-[calc(100vh-30px)]">
      <Header />
      <h1 className="text-white text-[20px] font-[860] mt-4">
        Boilerplate
      </h1>
    </div>
  );
};

export default page;
