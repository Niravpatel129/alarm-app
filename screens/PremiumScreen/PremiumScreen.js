import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionPage = () => {
  const [isProPlan, setIsProPlan] = useState(false);
  const [showMoreTestimonials, setShowMoreTestimonials] = useState(false);

  const togglePlan = () => {
    setIsProPlan(!isProPlan);
  };

  const toggleShowMoreTestimonials = () => {
    setShowMoreTestimonials(!showMoreTestimonials);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5R0CknnnYF_c0Siko_inKqJG8TcT8UTXWKA&usqp=CAU',
            }}
            style={styles.headerImage}
          />
          <Text style={styles.title}>Unlock Premium Features</Text>
          <Text style={styles.subtitle}>Choose the plan that's right for you</Text>
        </View>
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>{isProPlan ? 'Pro Plan' : 'Free Plan'}</Text>
            <Switch
              value={isProPlan}
              onValueChange={togglePlan}
              trackColor={{ false: '#E0E0E0', true: '#FF9800' }}
              thumbColor={isProPlan ? '#fff' : '#f4f3f4'}
              ios_backgroundColor='#E0E0E0'
            />
          </View>
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
              <Text style={[styles.featureText, styles.boldText]}>
                Unlimited access to all features
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
              <Text style={[styles.featureText, styles.boldText]}>Ad-free experience</Text>
            </View>
            {isProPlan && (
              <>
                <View style={styles.featureItem}>
                  <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
                  <Text style={styles.featureText}>Priority customer support</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
                  <Text style={styles.featureText}>Exclusive pro content</Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.comparisonTable}>
            <Text style={styles.comparisonTableTitle}>Plan Comparison</Text>
            <View style={styles.comparisonTableHeader}>
              <Text style={styles.comparisonTableHeaderText}>Features</Text>
              <Text style={styles.comparisonTableHeaderText}>Free Plan</Text>
              <Text style={styles.comparisonTableHeaderText}>Pro Plan</Text>
            </View>
            <View style={styles.comparisonTableRow}>
              <Text style={styles.comparisonTableRowText}>Unlimited access</Text>
              <Ionicons name='close-circle' size={24} color='#E0E0E0' />
              <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
            </View>
            <View style={styles.comparisonTableRow}>
              <Text style={styles.comparisonTableRowText}>Ad-free Experience</Text>
              <Ionicons name='close-circle' size={24} color='#E0E0E0' />
              <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
            </View>
            <View style={styles.comparisonTableRow}>
              <Text style={styles.comparisonTableRowText}>Priority support</Text>
              <Ionicons name='close-circle' size={24} color='#E0E0E0' />
              <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
            </View>
            <View style={styles.comparisonTableRow}>
              <Text style={styles.comparisonTableRowText}>Exclusive content</Text>
              <Ionicons name='close-circle' size={24} color='#E0E0E0' />
              <Ionicons name='checkmark-circle' size={24} color='#FF9800' />
            </View>
          </View>
          {isProPlan && (
            <>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>$9.99/month</Text>
                <Text style={styles.priceSubtext}>Billed annually at $119.88</Text>
              </View>
              <TouchableOpacity style={styles.subscribeButton}>
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              </TouchableOpacity>
              <Text style={styles.guaranteeText}>30-day money-back guarantee</Text>
            </>
          )}
          {!isProPlan && (
            <TouchableOpacity style={styles.tryFreeButton}>
              <Text style={styles.tryFreeButtonText}>Try Pro Plan for Free</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.socialProofContainer}>
          <Text style={styles.socialProofText}>Trusted by over 100,000 satisfied users</Text>
          <Image
            source={{
              uri: 'https://example.com/awards-image.jpg',
            }}
            style={styles.awardsImage}
          />
        </View>
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How does the free trial work?</Text>
            <Text style={styles.faqAnswer}>
              You can try the Pro Plan for free for 7 days. After the trial period, you will be
              charged the monthly subscription fee unless you cancel before the trial ends.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel my subscription anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can cancel your subscription at any time. If you cancel, your subscription
              will remain active until the end of the current billing cycle.
            </Text>
          </View>
          {/* Add more FAQ items */}
        </View>
        <View style={styles.testimonialsContainer}>
          <Text style={styles.testimonialsTitle}>What Our Users Say</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
          >
            <View style={styles.testimonialItem}>
              <View style={styles.testimonialHeader}>
                <Image
                  source={{
                    uri: 'https://example.com/user1.jpg',
                  }}
                  style={styles.testimonialImage}
                />
                <View style={styles.testimonialRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name='star' size={16} color='#FF9800' />
                  ))}
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "The Pro Plan is totally worth it! I love the ad-free experience and exclusive
                content."
              </Text>
              <Text style={styles.testimonialAuthor}>John Doe, Photographer</Text>
            </View>
            {/* Add more testimonial items */}
          </ScrollView>
          {!showMoreTestimonials && (
            <TouchableOpacity style={styles.seeMoreButton} onPress={toggleShowMoreTestimonials}>
              <Text style={styles.seeMoreButtonText}>See More</Text>
            </TouchableOpacity>
          )}
          {showMoreTestimonials && (
            <ScrollView contentContainerStyle={styles.moreTestimonialsList}>
              {/* Add more testimonial items */}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  planCard: {
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  planFeatures: {
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
    fontFamily: 'Roboto',
  },
  boldText: {
    fontWeight: 'bold',
  },
  comparisonTable: {
    padding: 20,
  },
  comparisonTableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  comparisonTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  comparisonTableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  comparisonTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  comparisonTableRowText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Roboto',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  priceSubtext: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Roboto',
  },
  subscribeButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  guaranteeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Roboto',
  },
  tryFreeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF9800',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 20,
  },
  tryFreeButtonText: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  socialProofContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Roboto',
  },
  awardsImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginTop: 10,
  },
  faqContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Roboto',
  },
  faqAnswer: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Roboto',
  },
  testimonialsContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  testimonialsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  testimonialsList: {
    paddingHorizontal: 10,
  },
  testimonialItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    marginRight: 20,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  testimonialImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  testimonialRating: {
    flexDirection: 'row',
  },
  testimonialText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Roboto',
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
  },
  seeMoreButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  seeMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  moreTestimonialsList: {
    paddingTop: 20,
  },
});

export default SubscriptionPage;
