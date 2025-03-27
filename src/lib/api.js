
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000',  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error) => {
 
  console.error('API Error:', error);
  
  if (error.response) {
   
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    return error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message: 'No response from server. Please try again later.',
    };
  } else {
    // Something happened in setting up the request
    return {
      success: false,
      message: 'Error setting up request. Please try again.',
    };
  }
};

// API endpoints
const apiService = {
  // PCOS Risk Prediction
  predictPCOS: async (healthData) => {
    try {
      const featuresArray = [
        Number(healthData.age),                   // Age
        Number(healthData.height),                // Height (cm)
        Number(healthData.weight),                // Weight (kg)
        Number(healthData.bmi),                   // BMI
        Number(healthData.cycleLength),           // Cycle Length (days)
        healthData.irregularPeriods === "yes" ? 1 : 0,  // Irregular Periods (1 for Yes, 0 for No)
        healthData.hairGrowth === "yes" ? 1 : 0,        // Excess Hair Growth (1 for Yes, 0 for No)
        healthData.hairLoss === "yes" ? 1 : 0,          // Hair Loss (1 for Yes, 0 for No)
        healthData.pimples === "yes" ? 1 : 0,           // Persistent Pimples (1 for Yes, 0 for No)
        healthData.skinDarkening === "yes" ? 1 : 0,     // Skin Darkening (1 for Yes, 0 for No)
        healthData.regExercise === "yes" ? 1 : 0,       // Regular Exercise (1 for Yes, 0 for No)
        healthData.fastFood === "yes" ? 1 : 0           // Frequent Fast Food (1 for Yes, 0 for No)
      ];
      console.log(featuresArray)
      const response = await api.post('/predict_pcos',{ features: featuresArray });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Menstrual Cycle Tracking
  trackCycle: async (cycleData) => {
    try {
      const response = await api.post('/track_cycle', cycleData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  getCycleHistory: async (userId) => {
    try {
      const response = await api.get(`/track_cycle/${userId}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Health Recommendations
  getRecommendations: async (userData) => {
    try {
      const response = await api.post('/get_recommendations', userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Community
  getCommunityPosts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/community_posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  createCommunityPost: async (postData) => {
    try {
      const response = await api.post('/community_posts', postData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  commentOnPost: async (postId, commentData) => {
    try {
      const response = await api.post(`/community_posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// For development - mock API responses when backend is not available
const useMockData = process.env.NODE_ENV === 'development';

if (useMockData) {
  // PCOS Risk Mock
  // apiService.predictPCOS = async (healthData) => {
  //   console.log('Mock API: Predicting PCOS with data', healthData);
  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 1000));
    
  //   // Calculate a pseudo-random risk based on input data
  //   const age = parseInt(healthData.age) || 25;
  //   const bmi = parseFloat(healthData.bmi) || 22;
  //   const irregularPeriods = healthData.irregularPeriods === 'yes' ? 15 : 0;
  //   const acne = healthData.acne === 'yes' ? 10 : 0;
  //   const hairLoss = healthData.hairLoss === 'yes' ? 10 : 0;
    
  //   // Calculate risk (this is NOT a real medical algorithm)
  //   let risk = 0;
  //   if (bmi > 25) risk += 15;
  //   if (age < 30) risk += 5;
  //   risk += irregularPeriods + acne + hairLoss;
    
  //   // Ensure risk is between 0-100%
  //   risk = Math.min(Math.max(risk, 5), 95);
    
  //   return {
  //     success: true,
  //     risk: risk,
  //     factors: [
  //       {
  //         name: 'BMI',
  //         impact: bmi > 25 ? 'high' : 'low',
  //         suggestion: bmi > 25 ? 'Consider discussing weight management with your doctor' : 'Your BMI is within a healthy range'
  //       },
  //       {
  //         name: 'Menstrual Regularity',
  //         impact: irregularPeriods ? 'high' : 'low',
  //         suggestion: irregularPeriods ? 'Track your cycle regularly and consult your doctor' : 'Regular cycles are a positive sign'
  //       },
  //       {
  //         name: 'Skin Health',
  //         impact: acne ? 'medium' : 'low',
  //         suggestion: acne ? 'Consider a dermatologist consultation' : 'Your skin health appears good'
  //       }
  //     ]
  //   };
  // };
  
  // Cycle Tracking Mock
  apiService.trackCycle = async (cycleData) => {
    console.log('Mock API: Tracking cycle with data', cycleData);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Cycle data recorded successfully',
      nextPeriod: new Date(new Date().setDate(new Date().getDate() + 28)).toISOString().split('T')[0],
      fertile: {
        start: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString().split('T')[0],
        end: new Date(new Date().setDate(new Date().getDate() + 17)).toISOString().split('T')[0]
      }
    };
  };
  
  apiService.getCycleHistory = async (userId) => {
    console.log('Mock API: Getting cycle history for user', userId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    
    return {
      success: true,
      cycles: [
        {
          startDate: twoMonthsAgo.toISOString().split('T')[0],
          endDate: new Date(twoMonthsAgo.getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          symptoms: ['cramps', 'fatigue'],
          flow: 'medium'
        },
        {
          startDate: lastMonth.toISOString().split('T')[0],
          endDate: new Date(lastMonth.getTime() + (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          symptoms: ['headache', 'cramps'],
          flow: 'heavy'
        }
      ],
      predictions: {
        nextPeriod: new Date(today.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        fertile: {
          start: new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          end: new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        }
      }
    };
  };
  
  // Recommendations Mock
  apiService.getRecommendations = async (userData) => {
    console.log('Mock API: Getting recommendations for user', userData);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      recommendations: {
        diet: [
          'Increase consumption of leafy greens and vegetables',
          'Consider adding more omega-3 fatty acids through fish or supplements',
          'Stay hydrated with at least 8 glasses of water daily',
          'Reduce processed foods and added sugars'
        ],
        exercise: [
          '30 minutes of moderate aerobic activity 5 times per week',
          'Consider adding strength training 2-3 times per week',
          'Yoga or stretching can help with stress and flexibility',
          'Listen to your body and adjust intensity based on your cycle'
        ],
        lifestyle: [
          'Prioritize 7-9 hours of quality sleep',
          'Practice stress management techniques like meditation',
          'Consider tracking mood changes alongside your cycle',
          'Schedule regular check-ups with your healthcare provider'
        ]
      }
    };
  };
  
  // Community Mock
  apiService.getCommunityPosts = async (page = 1, limit = 10) => {
    console.log('Mock API: Getting community posts', { page, limit });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      posts: [
        {
          id: '1',
          title: 'My PCOS Journey',
          content: 'I was diagnosed with PCOS last year and have been making lifestyle changes. It\'s been challenging but I\'m seeing improvements!',
          author: 'Sarah123',
          date: '2023-08-15T10:30:00Z',
          likes: 24,
          comments: [
            {
              id: '101',
              content: 'Thank you for sharing your story. What changes helped you the most?',
              author: 'Emily22',
              date: '2023-08-15T14:22:00Z'
            },
            {
              id: '102',
              content: 'I\'m just starting my journey. This is inspirational!',
              author: 'NewHere',
              date: '2023-08-16T09:15:00Z'
            }
          ]
        },
        {
          id: '2',
          title: 'Tips for Managing Period Pain',
          content: 'I\'ve found that a combination of gentle yoga, heating pads, and certain teas really helps with my cramps. What works for you all?',
          author: 'JennyB',
          date: '2023-08-10T15:45:00Z',
          likes: 36,
          comments: [
            {
              id: '201',
              content: 'Exercise is the last thing I want to do during cramps but it really does help!',
              author: 'FitnessLover',
              date: '2023-08-10T18:30:00Z'
            }
          ]
        },
        {
          id: '3',
          title: 'Question about Cycle Tracking Apps',
          content: 'Has anyone tried comparing different cycle tracking apps? Looking for recommendations on which ones are most accurate.',
          author: 'TechGirl',
          date: '2023-08-05T12:10:00Z',
          likes: 18,
          comments: [
            {
              id: '301',
              content: 'I\'ve been using Clue for years and find it very accurate!',
              author: 'AppUser123',
              date: '2023-08-05T13:42:00Z'
            },
            {
              id: '302',
              content: 'Flo has worked well for me. I like their health insights.',
              author: 'HealthNut',
              date: '2023-08-06T10:08:00Z'
            }
          ]
        }
      ],
      total: 42,
      page: page,
      limit: limit,
      totalPages: 5
    };
  };
  
  apiService.createCommunityPost = async (postData) => {
    console.log('Mock API: Creating community post', postData);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      post: {
        id: '999',
        title: postData.title,
        content: postData.content,
        author: 'CurrentUser',
        date: new Date().toISOString(),
        likes: 0,
        comments: []
      }
    };
  };
  
  apiService.commentOnPost = async (postId, commentData) => {
    console.log('Mock API: Commenting on post', { postId, commentData });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      comment: {
        id: '9999',
        content: commentData.content,
        author: 'CurrentUser',
        date: new Date().toISOString()
      }
    };
  };
}

export default apiService;
