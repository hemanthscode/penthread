import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PenTool, 
  Globe2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  BookOpen, 
  TrendingUp,
  MessageCircle,
  Heart,
  Zap
} from "lucide-react";
import { usePosts } from "../../hooks";
import PostCard from "../../components/posts/PostCard";
import Loader from "../../components/common/Loader";

const Home = () => {
  const { posts, loading, fetchPosts } = usePosts({ status: "published" });

  useEffect(() => {
    fetchPosts({ status: "published" });
  }, []);

  const features = [
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Express Yourself",
      description: "Share your stories, ideas, and perspectives with a global community of readers and writers."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect & Engage",
      description: "Build meaningful connections through comments, discussions, and collaborative storytelling."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Discover Content",
      description: "Explore diverse topics from technology to lifestyle, curated for your interests."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Grow Your Voice",
      description: "Track your impact with analytics, engage readers, and build your author presence."
    }
  ];

  const stats = [
    { icon: <BookOpen className="w-6 h-6" />, value: "1000+", label: "Stories Published" },
    { icon: <Users className="w-6 h-6" />, value: "500+", label: "Active Writers" },
    { icon: <MessageCircle className="w-6 h-6" />, value: "5000+", label: "Conversations" },
    { icon: <Heart className="w-6 h-6" />, value: "10K+", label: "Community Reactions" }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <PenTool className="text-blue-600 w-12 h-12" />
              </motion.div>
              <motion.div 
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Globe2 className="text-purple-600 w-12 h-12" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PenThread
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-4 leading-relaxed">
              Where Stories Come to Life
            </p>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join a vibrant community of writers and readers. Share your voice, discover compelling narratives, and engage in meaningful conversations.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/auth/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Writing
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md"
                >
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PenThread?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to share your stories and connect with readers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
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

      {/* Latest Posts Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-gray-600">
              Discover fresh perspectives from our community
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <Loader />
            </div>
          ) : posts.length > 0 ? (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.slice(0, 6).map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                No published posts yet. Be the first to share your story!
              </p>
            </div>
          )}

          {posts.length > 6 && (
            <div className="text-center mt-12">
              <Link
                to="/posts"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View All Posts
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of writers and readers in our growing community. Your voice matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth/register"
              className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link
              to="/auth/login"
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;