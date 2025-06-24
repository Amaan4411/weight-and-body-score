import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Modal,
  Share,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Calendar, DateData} from 'react-native-calendars';

function DiagonalPattern({color = '#eaeaea', barHeight = 90, barWidth = 100}) {
  const [patternX, setPatternX] = useState(0);

  useEffect(() => {
    const animatedValue = new Animated.Value(0);
    const listener = animatedValue.addListener(({ value }) => {
      setPatternX(value);
    });

    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 20, // Looping from 0 to 20
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, []);

  // Diagonal lines from top-right to bottom-left, starting exactly at the top border
  const stripeSpacing = 10;
  const numStripes = Math.ceil((barWidth + barHeight) / stripeSpacing);
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: -4, // Move up so lines start at the black border
        width: barWidth,
        height: barHeight + 4, // Extend to cover the border
        backgroundColor: '#fff',
        borderRadius: 0,
        overflow: 'hidden',
      }}>
      {Array.from({length: numStripes}).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: barWidth - i * stripeSpacing + patternX,
            top: 0,
            width: 4,
            height: barHeight + 4,
            backgroundColor: color,
            opacity: 0.25,
            transform: [{rotate: '45deg'}],
          }}
        />
      ))}
    </View>
  );
}

export default function BodyScoreScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const onDayPress = (day: DateData) => {
    setSelectedDate(new Date(day.timestamp));
    setShowCalendar(false);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out my Body Score: 79/100! #Health #Fitness',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Sharing Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Body Score</Text>
        <TouchableOpacity>
          <Icon name="dots-vertical" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Date and Share */}
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowCalendar(true)}>
          <Icon
            name="calendar-month"
            size={22}
            color="#2196f3"
            style={{marginRight: 6}}
          />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Icon
            name="chevron-down"
            size={22}
            color="#2196f3"
            style={{marginLeft: 2}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
          <Icon name="share-variant" size={22} color="#2196f3" />
        </TouchableOpacity>
      </View>

      {/* Score */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreNum}>79</Text>
        <Text style={styles.scoreOutOf}>/100</Text>
      </View>
      <View style={styles.currentScoreRow}>
        <Text style={[styles.currentScoreText, {color: '#000'}]}>
          Current Score
        </Text>
        <Icon name="fire" size={20} color="#ff9800" style={{marginLeft: 4}} />
      </View>

      {/* Bar Chart - match the image exactly */}
      <View style={styles.barChartRow}>
        {/* Last month */}
        <View style={styles.barCol}>
          <Text style={styles.barLabelTop}>Last month</Text>
          <View
            style={[styles.bar, styles.barLastMonth, styles.barWithTopBorder]}>
            <DiagonalPattern color="#bbb" barHeight={90} barWidth={100} />
          </View>
          <View style={styles.barBottomRow}>
            <Text style={styles.barAvg}>Avg</Text>
            <Text style={styles.barValue}>50</Text>
          </View>
        </View>
        {/* Last week */}
        <View style={styles.barCol}>
          <Text style={styles.barLabelTop}>Last week</Text>
          <View
            style={[styles.bar, styles.barLastWeek, styles.barWithTopBorder]}>
            <DiagonalPattern color="#bbb" barHeight={135} barWidth={100} />
          </View>
          <View style={[styles.barBottomRow, {justifyContent: 'flex-end'}]}>
            <Text style={styles.barValue}>64</Text>
          </View>
        </View>
        {/* This week */}
        <View style={styles.barCol}>
          <Text style={styles.barLabelTop}>This week</Text>
          <View
            style={[styles.bar, styles.barThisWeek, styles.barWithTopBorder]}>
            <View style={styles.barThisWeekLabel}>
              <Text style={styles.barThisWeekPercent}>+4%</Text>
            </View>
          </View>
          <View style={[styles.barBottomRow, {justifyContent: 'flex-end'}]}>
            <Text style={styles.barValue}>78</Text>
          </View>
        </View>
      </View>

      {/* Health Status */}
      <View style={styles.healthBox}>
        <View style={styles.healthRow}>
          <Icon name="heart-circle" size={28} color="#2ecc71" />
          <Text style={styles.healthyText}>You are healthy</Text>
        </View>
        <Text style={styles.keepText}>
          Keep or increase your healthy score!
        </Text>
        <View style={styles.healthBarRow}>
          <View
            style={[styles.healthBar, {backgroundColor: '#222', flex: 2}]}
          />
          <View
            style={[
              styles.healthBar,
              {backgroundColor: '#222', flex: 2, marginLeft: 4},
            ]}
          />
          <View
            style={[
              styles.healthBar,
              {backgroundColor: '#222', flex: 1, marginLeft: 4},
            ]}
          />
          <View
            style={[
              styles.healthBar,
              {backgroundColor: '#eee', flex: 1, marginLeft: 4},
            ]}
          />
        </View>
        <View style={styles.healthBarLabels}>
          <Text style={styles.unhealthyLabel}>Unhealthy</Text>
          <Text style={styles.veryHealthyLabel}>Very Healthy</Text>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
        animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowCalendar(false)}>
          <View style={styles.calendarModalContent}>
            <Calendar
              current={selectedDate.toISOString().split('T')[0]}
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: '#2196f3',
                },
              }}
              theme={{
                arrowColor: '#2196f3',
                todayTextColor: '#2196f3',
                selectedDayTextColor: '#ffffff',
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#eaeaea',
    marginVertical: 10,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
  },
  shareBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  scoreNum: {
    fontSize: 90,
    fontWeight: 'bold',
    color: '#222',
  },
  scoreOutOf: {
    fontSize: 30,
    fontWeight: '600',
    color: '#aaa',
    marginLeft: 5,
  },
  currentScoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 20,
  },
  currentScoreText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 25,
    height: 200, // Fixed height for chart area
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barLabelTop: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  bar: {
    width: '55%', // Adjusted for better spacing
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  barWithTopBorder: {
    borderTopWidth: 4,
    borderTopColor: '#222',
  },
  barLastMonth: {
    height: 90,
  },
  barLastWeek: {
    height: 135,
  },
  barThisWeek: {
    height: 180,
    backgroundColor: '#2196f3',
  },
  barThisWeekLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  barThisWeekPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  barBottomRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  barAvg: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 4,
  },
  barValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  healthBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginLeft: 10,
  },
  keepText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
  },
  healthBarRow: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  healthBar: {
    height: '100%',
  },
  healthBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  unhealthyLabel: {
    fontSize: 13,
    color: '#777',
  },
  veryHealthyLabel: {
    fontSize: 13,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
}); 