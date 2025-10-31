import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PenTool,
  Globe2,
  Shield,
  Users,
  Sparkles,
  Target,
  Heart,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Rich Text Editor",
      description: "Write with our intuitive editor featuring formatting tools, media embedding, and draft saving capabilities."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Role-Based Access",
      description: "Secure platform with admin, author, and user roles ensuring proper content management and moderation."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Engagement Tools",
      description: "Foster discussions with comments, likes, favorites, and notification systems to keep your community active."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Track your content performance with detailed insights on views, engagement, and audience growth."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Content Organization",
      description: "Categorize posts with tags and categories, making content discovery seamless for your readers."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Content Moderation",
      description: "Maintain quality with approval workflows, status management, and moderation tools for comments and posts."
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community First",
      description: "We believe in fostering authentic connections between writers and readers through meaningful engagement."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Quality Content",
      description: "We prioritize high-quality storytelling and provide tools that help creators produce their best work."
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "Inclusive Platform",
      description: "Everyone has a story to tell. We create a welcoming space for diverse voices and perspectives."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Creator Empowerment",
      description: "We give writers the tools, insights, and audience they need to grow and succeed in their craft."
    }
  ];

  const userTypes = [
    {
      role: "Readers",
      icon: <BookOpen className="w-10 h-10" />,
      benefits: [
        "Discover curated content across diverse topics",
        "Engage with authors through comments and discussions",
        "Save favorites and build your reading collection",
        "Personalized content recommendations"
      ]
    },
    {
      role: "Authors",
      icon: <PenTool className="w-10 h-10" />,
      benefits: [
        "Powerful editor with draft and publish capabilities",
        "Audience analytics and engagement metrics",
        "Community building through follower systems",
        "Content categorization and tagging tools"
      ]
    },
    {
      role: "Admins",
      icon: <Shield className="w-10 h-10" />,
      benefits: [
        "Complete content moderation dashboard",
        "User and role management capabilities",
        "Platform analytics and insights",
        "Content approval and rejection workflows"
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 md:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <PenTool className="text-blue-600 w-12 h-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Globe2 className="text-purple-600 w-12 h-12" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About PenThread
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
              A Modern Platform for Writers and Readers
            </p>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              PenThread is built to empower storytellers and connect them with engaged audiences. 
              Whether you're sharing technical insights, creative fiction, or personal experiences, 
              our platform provides everything you need to write, publish, and grow your voice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Zap className="w-16 h-16 mx-auto text-blue-600 mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              We're on a mission to democratize content creation and make meaningful storytelling 
              accessible to everyone. PenThread bridges the gap between writers seeking an audience 
              and readers hungry for authentic, quality content.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By combining powerful publishing tools with robust community features, we create 
              an ecosystem where ideas flourish, conversations thrive, and every voice finds its audience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, share, and grow your content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you read, write, or manage, PenThread has the tools you need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl text-blue-600 mx-auto mb-6">
                  {type.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
                  {type.role}
                </h3>
                <ul className="space-y-3">
                  {type.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <Users className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Start your writing journey or discover your next favorite story. 
            PenThread is where meaningful content and engaged readers meet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Explore Stories
              <BookOpen className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default About;