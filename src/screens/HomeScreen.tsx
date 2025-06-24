import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, {Path, Defs, Line, Pattern} from 'react-native-svg';

const WEIGHT = 56.0;
const GOAL = 100;
const PERCENTAGE = WEIGHT / GOAL;

interface WeightGaugeProps {
  percentage: number;
}

const WeightGauge: React.FC<WeightGaugeProps> = ({percentage}) => {
  const [patternX, setPatternX] = useState(0);

  useEffect(() => {
    const animatedValue = new Animated.Value(0);
    const listener = animatedValue.addListener(({ value }) => {
      setPatternX(value);
    });

    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 24,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, []);

  const {width: screenWidth} = Dimensions.get('window');
  const gaugeWidth = screenWidth * 0.8; // Use 80% of screen width

  const radius = gaugeWidth / 2 * 0.7; // 70% of half the gauge width
  const strokeWidth = gaugeWidth / 2 * 0.6; // 60% of half the gauge width
  const size = (radius + strokeWidth) * 2;
  const center = size / 2;
  const angle = percentage * 180;

  const polarToCartesian = (angle: number) => {
    const a = (angle - 180) * (Math.PI / 180.0);
    const x = center + radius * Math.cos(a);
    const y = center + radius * Math.sin(a);
    return {x, y};
  };

  const end = polarToCartesian(angle);

  const backgroundPath = `M${strokeWidth},${center} A${radius},${radius} 0 1,1 ${
    size - strokeWidth
  },${center}`;
  const foregroundPath = `M${strokeWidth},${center} A${radius},${radius} 0 ${
    angle > 180 ? 1 : 0
  },1 ${end.x},${end.y}`;

  const sepAngleRad = (angle - 180) * (Math.PI / 180.0);
  const sepRadiusStart = radius - strokeWidth / 2;
  const sepRadiusEnd = radius + strokeWidth / 2;
  const sepStart = {
    x: center + sepRadiusStart * Math.cos(sepAngleRad),
    y: center + sepRadiusStart * Math.sin(sepAngleRad),
  };
  const sepEnd = {
    x: center + sepRadiusEnd * Math.cos(sepAngleRad),
    y: center + sepRadiusEnd * Math.sin(sepAngleRad),
  };

  return (
    <View style={{alignItems: 'center', marginTop: 10, marginBottom: 5, justifyContent: 'center'}}>
      <Svg width={size} height={center + strokeWidth}>
        <Defs>
          <Pattern
            id="stripes"
            patternUnits="userSpaceOnUse"
            width="24"
            height="24"
            x={patternX}
            >
            <Path
              d="M-4,4 l8,-8 M0,24 l24,-24 M20,28 l8,-8"
              stroke="#D1D1D1"
              strokeWidth="8"
            />
          </Pattern>
        </Defs>

        <Path
          d={backgroundPath}
          stroke="url(#stripes)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="butt"
        />
        <Path
          d={foregroundPath}
          stroke="#2176FF"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="butt"
        />
        <Line
          x1={sepStart.x}
          y1={sepStart.y}
          x2={sepEnd.x}
          y2={sepEnd.y}
          stroke="black"
          strokeWidth={3}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '48%',
          alignItems: 'center',
        }}
      >
        <Text style={[styles.gaugeTextValue, {fontSize: screenWidth * 0.15}]}>
          {WEIGHT.toFixed(0)}
          <Text style={[styles.gaugeTextDecimal, {fontSize: screenWidth * 0.08}]}>.0</Text>
        </Text>
        <Text style={[styles.gaugeTextLabel, {fontSize: screenWidth * 0.04}]}>Kilogram</Text>
      </View>
    </View>
  );
};

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="menu" size={28} color="#333" />
          <View style={styles.headerIcons}>
            <Icon name="search" size={28} color="#333" />
            <Image
              source={{uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'}}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Start Calculate</Text>
        <Text style={styles.title}>Your Weight</Text>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Image
              source={{uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704e'}}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>Claire Regina</Text>
            <Icon name="chevron-down" size={20} color="#555" />
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Icon name="refresh-cw" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Weight Gauge */}
        <WeightGauge percentage={PERCENTAGE} />

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('BodyScore')}>
          <Text style={styles.ctaText}>Check Your Overall Body Score</Text>
          <View style={styles.ctaIconContainer}>
            <Icon name="arrow-right" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Body Fat Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoCardIcon}>
              <Icon name="user" size={20} color="#333" />
            </View>
            <Text style={styles.infoCardTitle}>Body Fat</Text>
          </View>
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardValue}>24,4 %</Text>
            <View style={styles.infoCardSubValueContainer}>
              <Text style={styles.infoCardSubValue}>13.6 kg</Text>
            </View>
            <Text style={styles.infoCardStatusNormal}>Normal</Text>
          </View>
          <TouchableOpacity style={styles.infoCardArrow}>
            <Icon name="arrow-right" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Muscle Mass Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoCardIcon}>
              <Icon name="activity" size={20} color="#333" />
            </View>
            <Text style={styles.infoCardTitle}>Muscle Mass</Text>
          </View>
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardValue}>70,2 %</Text>
            <View style={styles.infoCardSubValueContainer}>
              <Text style={styles.infoCardSubValue}>41.2 kg</Text>
            </View>
            <Text style={styles.infoCardStatusGood}>Good</Text>
          </View>
          <TouchableOpacity style={styles.infoCardArrow}>
            <Icon name="arrow-right" size={24} color="#aaa" />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111',
    lineHeight: 42,
    paddingHorizontal: 20,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    color: '#333',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  gaugeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeWeight: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#111',
  },
  gaugeLabel: {
    fontSize: 16,
    color: '#777',
    marginTop: -5,
  },
  ctaButton: {
    backgroundColor: '#111',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginTop: 0,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaIconContainer: {
    backgroundColor: '#007aff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoCardIcon: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  infoCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  infoCardSubValueContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  infoCardSubValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  infoCardStatusNormal: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
  },
  infoCardStatusGood: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '600',
    color: '#007aff',
  },
  infoCardArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12,
  },
  gaugeTextValue: {
    fontWeight: 'bold',
    color: '#111',
    letterSpacing: -2,
  },
  gaugeTextDecimal: {
    fontWeight: '400',
    color: '#888',
  },
  gaugeTextLabel: {
    color: '#222',
    marginTop: -5,
  },
});

export default HomeScreen; 