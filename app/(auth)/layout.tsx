const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-blue-200 flex items-center justify-center ">
      {children}
    </div>
  );
};

export default AuthLayout;
