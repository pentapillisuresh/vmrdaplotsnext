import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Chandrika Kosuri',
      role: 'Homeowner',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'Excellent service from Praveen, the best vizag realtor.'
    },
    {
      id: 2,
      name: 'Chinni Rambabu',
      role: 'Investor',
      image: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      text: 'Vizaglands is Good investment place its like good looking ventures is there'
    },
    {
      id: 3,
      name: 'Srujika Varma',
      role: 'Property Buyer',
      image: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      text: 'Very good service, quick response, Excellent projects'
    },
    {
      id: 4,
      name: 'Arjun K.',
      role: 'Homeowner',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Found my dream apartment within weeks! The property selection was excellent and the entire buying process was smooth.'
    }
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-2.5 rounded-full font-semibold text-sm uppercase tracking-[0.15em] shadow-lg">
              Testimonials
            </span>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-4xl font-serif font-bold text-center mb-4 text-gray-900 uppercase"
        >
          Client Testimonials
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed"
        >
          See what our satisfied clients have to say about their experience with VMRDA Plots
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 hover:border-orange-200"
            >
              {/* Premium Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 transform rotate-45 translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-orange-100 text-4xl font-serif opacity-30">
                "
              </div>

              <div className="flex items-center mb-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-orange-100 group-hover:border-orange-300 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-5 h-5 text-orange-500 fill-current drop-shadow-sm"
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </motion.div>
          ))}
        </motion.div>

      
      </div>
    </section>
  );
};

export default Testimonials;