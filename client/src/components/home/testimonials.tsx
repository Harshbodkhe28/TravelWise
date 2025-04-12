import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="text-amber-400 flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" fill="none" stroke="currentColor" />
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 12 2z" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">What Travelers Say</h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        Read experiences from travelers who found their perfect trip through TravelWise.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              {renderStars(testimonial.rating)}
              <span className="ml-2 text-gray-600 text-sm">{testimonial.rating.toFixed(1)}</span>
            </div>
            <p className="text-gray-700 mb-4">{testimonial.content}</p>
            <div className="flex items-center">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.trip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
