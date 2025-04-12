export default function HowItWorks() {
  const steps = [
    {
      icon: "clipboard-list",
      title: "Share Your Travel Preferences",
      description: "Tell us where you want to go, when, and what your budget is."
    },
    {
      icon: "briefcase",
      title: "Receive Custom Packages",
      description: "Travel agencies prepare personalized packages based on your needs."
    },
    {
      icon: "plane-departure",
      title: "Book Your Perfect Trip",
      description: "Compare offers, choose the best one, and book directly through our platform."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">How TravelWise Works</h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        We connect you with verified travel agencies who compete to provide you with the best travel experience.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="bg-blue-50 h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="text-secondary text-2xl" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                {step.icon === "clipboard-list" && (
                  <>
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                    <rect height="4" rx="1" width="6" x="9" y="3"/>
                    <path d="M9 14h.01"/>
                    <path d="M13 14h2"/>
                    <path d="M9 18h.01"/>
                    <path d="M13 18h2"/>
                  </>
                )}
                {step.icon === "briefcase" && (
                  <>
                    <path d="M20 7h-16a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1z"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <path d="M12 12v3"/>
                    <path d="M3 15a5.14 5.14 0 0 0 4 0"/>
                    <path d="M17 15a5.14 5.14 0 0 0 4 0"/>
                  </>
                )}
                {step.icon === "plane-departure" && (
                  <>
                    <path d="M22 12a2 2 0 0 0-2-2H7A5 5 0 0 0 2 12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2Z"/>
                    <path d="M19 12H5"/>
                    <path d="M16 6s0-2 2-2 2 2 2 2v6"/>
                    <path d="M4 18v-6"/>
                  </>
                )}
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
