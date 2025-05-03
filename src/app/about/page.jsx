import Layout from "@/components/layout"

const About = () => {
  return (
    <Layout>
    <div>
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">About EventMaster</h1>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                EventMaster was founded in 2025 with a simple mission: to connect people through unforgettable experiences. What started as a small startup has grown into a leading platform for event discovery and management, serving millions of users worldwide.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of passionate event enthusiasts and tech experts work tirelessly to bring you the best events in your area and provide seamless tools for event organizers to create and manage their events.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At EventMaster, our mission is to enrich lives by facilitating meaningful connections and experiences through events. We believe that every event has the power to inspire, educate, and bring people together.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Sets Us Apart</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Curated selection of high-quality events</li>
                <li>User-friendly platform for both attendees and organizers</li>
                <li>Robust ticketing and management tools</li>
                <li>Dedicated customer support team</li>
                <li>Commitment to innovation and continuous improvement</li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet Our Team</h2>
              <div className=" flex items-center justify-center">
                <div className="text-center">
                  <img src="3.jpg" alt="CEO" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover object-top " />
                  <h3 className="text-lg font-semibold text-gray-900">Pranav Deshmukh</h3>
                  <p className="text-gray-600">CEO & founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default About
