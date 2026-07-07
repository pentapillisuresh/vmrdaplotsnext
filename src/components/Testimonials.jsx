import { FiStar } from 'react-icons/fi';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Arjun K.',
      role: 'Homeowner',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Found my dream apartment within weeks! The property selection was excellent and the entire buying process was smooth.'
    },
    {
      id: 2,
      name: 'Sneha R.',
      role: 'Investor',
      image: 'https://img.freepik.com/free-photo/side-view-smiley-woman-wearing-eye-patches_23-2149479355.jpg?t=st=1762748965~exp=1762752565~hmac=bfdf5f81f04a789616b55836ad5835271fbd8cce07a6caec8d7e82c6387e6caf&w=1060',
      rating: 5,
      text: 'Outstanding service! They guided me through everything and helped negotiate a fantastic deal on my property.'
    },
    {
      id: 3,
      name: 'Rajesh M.',
      role: 'First-time Buyer',
      image: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      text: 'As a first-time buyer, I was nervous but the team made everything so easy to understand and stress-free.'
    },
    {
      id: 4,
      name: 'Priya S.',
      role: 'Property Seller',
      image: 'https://img.freepik.com/free-photo/young-pretty-model-is-smiling_114579-13323.jpg?t=st=1762748877~exp=1762752477~hmac=7d402ef0260e4644f6dc6261cee138269cc2c358d00a7207eb6637530b75a32b&w=1060',
      rating: 5,
      text: 'Sold my property in record time! Professional service and great market insights from the team.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 animate-fadeIn">
          <div className="inline-block">
            <span className="text-orange-500 font-medium text-sm uppercase tracking-wider bg-orange-50 px-4 py-2 rounded-full">
              Testimonials
            </span>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-gray-800 animate-slideUp">
          Client Testimonials
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto animate-slideUp">
          See what our satisfied clients have to say about their experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 border-4 border-orange-100"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-5 h-5 text-orange-500 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
