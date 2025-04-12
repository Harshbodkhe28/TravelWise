import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">Why Choose TravelWise</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Our platform offers unique features to make your travel planning experience better.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-full flex items-center justify-center mb-4`}>
                <svg className={`text-${feature.color}-500 text-xl`} fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  {feature.icon === "thumbs-up" && (
                    <path d="M7 10v12m8-16.12L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                  )}
                  {feature.icon === "dollar-sign" && (
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  )}
                  {feature.icon === "calendar-alt" && (
                    <>
                      <rect height="18" rx="2" width="18" x="3" y="4"/>
                      <path d="M16 2v4"/>
                      <path d="M8 2v4"/>
                      <path d="M3 10h18"/>
                      <path d="M8 14h.01"/>
                      <path d="M12 14h.01"/>
                      <path d="M16 14h.01"/>
                      <path d="M8 18h.01"/>
                      <path d="M12 18h.01"/>
                      <path d="M16 18h.01"/>
                    </>
                  )}
                  {feature.icon === "comments" && (
                    <>
                      <path d="M8 12h.01M12 12h.01M16 12h.01"/>
                      <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 14.821 3 13.447 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"/>
                    </>
                  )}
                  {feature.icon === "shield-alt" && (
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                  )}
                  {feature.icon === "star" && (
                    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
                  )}
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
