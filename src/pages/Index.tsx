
import ClickCounter from "@/components/ClickCounter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">The Button</h1>
        <ClickCounter />
      </div>
    </div>
  );
};

export default Index;
