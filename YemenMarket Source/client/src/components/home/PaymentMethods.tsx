import { useQuery } from "@tanstack/react-query";

interface PaymentMethod {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
}

const PaymentMethods = () => {
  const { data: paymentMethods = [], isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ['/api/payment-methods'],
  });

  if (isLoading) {
    return (
      <section className="mb-8 bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4">طرق الدفع المتاحة</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-12 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-bold mb-4">طرق الدفع المتاحة</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex justify-center items-center bg-gray-50 rounded-lg p-2 h-12">
            <img src={method.image} alt={method.name} className="h-6 object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentMethods;
