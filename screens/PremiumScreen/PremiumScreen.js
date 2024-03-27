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

  const togglePlan = () => {
    setIsProPlan(!isProPlan);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Premium Features</Text>
          <Text style={styles.subtitle}>Choose the plan that's right for you</Text>
        </View>
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>{isProPlan ? 'Pro Plan' : 'Free Plan'}</Text>
            <Switch
              value={isProPlan}
              onValueChange={togglePlan}
              trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
              thumbColor={isProPlan ? '#fff' : '#f4f3f4'}
              ios_backgroundColor='#D1D1D6'
            />
          </View>
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
              <Text style={styles.featureText}>Unlimited access to all features</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
              <Text style={styles.featureText}>Ad-free experience</Text>
            </View>
            {isProPlan && (
              <>
                <View style={styles.featureItem}>
                  <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
                  <Text style={styles.featureText}>Priority customer support</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
                  <Text style={styles.featureText}>Exclusive pro content</Text>
                </View>
              </>
            )}
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
            </>
          )}
        </View>
        <View style={styles.testimonialsContainer}>
          <Text style={styles.testimonialsTitle}>What Our Users Say</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
          >
            <View style={styles.testimonialItem}>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVhtFJc9v3hEBfhJiOhYMS_60ieEbiOjPJyxl8F2dIBw&s',
                }}
                style={styles.testimonialImage}
              />
              <Text style={styles.testimonialText}>
                "The Pro Plan is totally worth it! I love the ad-free experience and exclusive
                content."
              </Text>
              <Text style={styles.testimonialAuthor}>John Doe</Text>
            </View>
            {/* Add more testimonial items */}
          </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
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
    borderBottomColor: '#E5E5EA',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#000',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  priceSubtext: {
    fontSize: 18,
    color: '#8E8E93',
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  testimonialsContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  testimonialsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  testimonialsList: {
    paddingHorizontal: 10,
  },
  testimonialItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 20,
    marginRight: 20,
    width: 300,
    alignItems: 'center',
  },
  testimonialImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  testimonialText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  testimonialAuthor: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default SubscriptionPage;
