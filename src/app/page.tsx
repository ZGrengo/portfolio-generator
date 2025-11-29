import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#7EA8BE' }}>
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 w-full">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Create Your Professional Portfolio
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Build a stunning portfolio website in minutes. Showcase your projects, skills, and experience with our easy-to-use portfolio generator.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/auth/login"
              className="text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: '#C2948A' }}
            >
              Get Started
            </a>
            <a
              href="#features"
              className="text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all border-2 hover:scale-105 hover:bg-[#B0837A] hover:border-[#B0837A]"
              style={{ borderColor: '#C2948A', backgroundColor: 'transparent' }}
            >
              Learn More
            </a>
          </div>

          <div id="features" className="mt-24 space-y-16">
            {/* Feature Highlights Section */}
            <div>
              <div className="flex items-center gap-3 mb-12 justify-center">
                <span className="text-4xl">🚀</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Feature Highlights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Dynamic Portfolio Pages</h3>
                  <p className="text-gray-600 text-sm">
                    Every section — projects, skills, experience — updates live based on your data.
                  </p>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Two Professional Templates</h3>
                  <p className="text-gray-600 text-sm">
                    A clean modern design with animations, and a minimalistic editorial layout for a refined look.
                  </p>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Image Galleries</h3>
                  <p className="text-gray-600 text-sm">
                    Your project images are displayed in a polished gallery carousel with thumbnails and navigation.
                  </p>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Color System</h3>
                  <p className="text-gray-600 text-sm">
                    Your chosen palette automatically controls the entire theme, keeping visuals consistent and elegant.
                  </p>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive by Design</h3>
                  <p className="text-gray-600 text-sm">
                    Beautiful on desktop, tablet, and mobile — your portfolio always looks professional.
                  </p>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Anywhere</h3>
                  <p className="text-gray-600 text-sm">
                    Generate a unique URL and share it on LinkedIn, resumes, or job applications.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#C2948A' }}>
                      1
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Create your profile</h3>
                      <p className="text-gray-700 mb-2">
                        Start by adding the basics: title, description, skills, experience, and education.
                      </p>
                      <p className="text-gray-600 text-sm">
                        You can update your information anytime — everything stays neatly organized in your dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#C2948A' }}>
                      2
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Add your projects</h3>
                      <p className="text-gray-700 mb-2">
                        Upload images, links, descriptions, and technologies used in each project.
                      </p>
                      <p className="text-gray-600 text-sm">
                        Your visuals are displayed in beautiful responsive carousels, optimized for fast loading.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#C2948A' }}>
                      3
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a template</h3>
                      <p className="text-gray-700 mb-2">
                        Pick between multiple professionally designed layouts — modern, minimalistic, or aesthetic-focused.
                      </p>
                      <p className="text-gray-600 text-sm">
                        Each template adapts your content automatically using your chosen color palette.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#C2948A' }}>
                      4
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Customize your style</h3>
                      <p className="text-gray-700 mb-2">
                        Select primary, secondary, and highlight colors to create a portfolio that reflects your personality or brand.
                      </p>
                      <p className="text-gray-600 text-sm">
                        Your entire design updates instantly with your chosen theme.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#C2948A' }}>
                      5
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Publish & share</h3>
                      <p className="text-gray-700 mb-2">
                        Once you&apos;re happy with your portfolio, simply share the automatically generated link.
                      </p>
                      <p className="text-gray-600 text-sm">
                        Your page is fully responsive, optimized, and accessible on any device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-auto" style={{ backgroundColor: '#28536B', borderColor: '#28536B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-white/80">
            © {new Date().getFullYear()} Portfolio Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
