import { FiHeart, FiMapPin } from 'react-icons/fi';
import { BiBed, BiBath } from 'react-icons/bi';

const PropertyCard = ({ property }) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {property.type}
        </div>

        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:bg-orange-500 hover:text-white group/heart">
          <FiHeart className="w-5 h-5 transition-transform duration-300 group-hover/heart:scale-110" />
        </button>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
        {property.price ?(
          <span className="text-gray-800 font-bold text-lg">{property.price}</span>
        ):(
          <span className="text-gray-500 text-sm">{property.price}</span>
        )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors duration-300">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-4">
          <FiMapPin className="w-4 h-4 mr-2 text-orange-500" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center space-x-6 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center text-gray-600">
            <BiBed className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-sm">{property.beds} Beds</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BiBath className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-sm">{property.baths} Baths</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={property.agentImage}
              alt={property.agent}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{property.agent}</p>
              <p className="text-xs text-gray-500">{property.timeAgo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
