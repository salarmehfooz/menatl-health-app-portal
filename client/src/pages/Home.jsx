import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, Shield, Users, MessageCircle, Calendar, Activity, ArrowRight, Star, CheckCircle } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: MessageCircle,
      title: "Confidential Chat",
      description: "Connect with licensed therapists through secure, private messaging",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments that fit your schedule with instant confirmations",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Activity,
      title: "Mood Tracking",
      description: "Monitor your emotional well-being with personalized insights",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and protected with the highest security standards",
      color: "from-amber-500 to-amber-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "MindCare has transformed my approach to mental health. The therapists are incredibly supportive and the platform is so easy to use.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The mood tracking feature helped me identify patterns I never noticed. It's like having a personal mental health companion.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      content: "Scheduling appointments is seamless, and the chat feature makes it easy to stay connected with my therapist between sessions.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Mental Health,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Our Priority</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">Connect with licensed therapists, track your mood, and access personalized mental health resources in a safe, supportive environment designed for your well-being.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <Link to="/login" className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                    Sign In
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Everything You Need for Mental Wellness</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our comprehensive platform provides tools and support to help you maintain and improve your mental health.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Stories of Transformation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real experiences from people who've found support and healing through our platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">Join thousands of people who've taken the first step toward better mental health.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-blue-100 mb-4 sm:mb-0">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Free to get started</span>
            </div>
            <div className="flex items-center text-blue-100 mb-4 sm:mb-0">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>24/7 support available</span>
            </div>
            <div className="flex items-center text-blue-100">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Completely confidential</span>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-8">
              <Link to="/register" className="group inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
