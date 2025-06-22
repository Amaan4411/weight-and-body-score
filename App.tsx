import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform, Modal, Share, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar, DateData } from 'react-native-calendars';

const { width } = Dimensions.get('window');

function DiagonalPattern({ color = '#eaeaea', barHeight = 90, barWidth = 100 }) {
  // Diagonal lines from top-right to bottom-left, starting exactly at the top border
  const stripeSpacing = 10;
  const numStripes = Math.ceil((barWidth + barHeight) / stripeSpacing);
  return (
    <View style={{
      position: 'absolute',
      left: 0,
      top: -4, // Move up so lines start at the black border
      width: barWidth,
      height: barHeight + 4, // Extend to cover the border
      backgroundColor: '#fff',
      borderRadius: 0,
      overflow: 'hidden',
    }}>
      {Array.from({ length: numStripes }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: barWidth - i * stripeSpacing,
            top: 0,
            width: 4,
            height: barHeight + 4,
            backgroundColor: color,
            opacity: 0.25,
            transform: [{ rotate: '45deg' }],
          }}
        />
      ))}
    </View>
  );
}

export default function App() {
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
    } catch (error: any) {
      Alert.alert('Sharing Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
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
        <TouchableOpacity style={styles.dateBox} onPress={() => setShowCalendar(true)}>
          <Icon name="calendar-month" size={22} color="#2196f3" style={{ marginRight: 6 }} />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Text>
          <Icon name="chevron-down" size={22} color="#2196f3" style={{ marginLeft: 2 }} />
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
        <Text style={[styles.currentScoreText, { color: '#000' }]}>Current Score</Text>
        <Icon name="fire" size={20} color="#ff9800" style={{ marginLeft: 4 }} />
      </View>

      {/* Bar Chart - match the image exactly */}
      <View style={styles.barChartRow}>
        {/* Last month */}
        <View style={styles.barCol}>
          <Text style={styles.barLabelTop}>Last month</Text>
          <View style={[styles.bar, styles.barLastMonth, styles.barWithTopBorder]}>
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
          <View style={[styles.bar, styles.barLastWeek, styles.barWithTopBorder]}>
            <DiagonalPattern color="#bbb" barHeight={135} barWidth={100} />
          </View>
          <View style={[styles.barBottomRow, { justifyContent: 'flex-end' }]}>
            <Text style={styles.barValue}>64</Text>
          </View>
        </View>
        {/* This week */}
        <View style={styles.barCol}>
          <Text style={styles.barLabelTop}>This week</Text>
          <View style={[styles.bar, styles.barThisWeek, styles.barWithTopBorder]}> 
            <View style={styles.barThisWeekLabel}>
              <Text style={styles.barThisWeekPercent}>+4%</Text>
            </View>
          </View>
          <View style={[styles.barBottomRow, { justifyContent: 'flex-end' }]}>
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
        <Text style={styles.keepText}>Keep or increase your healthy score!</Text>
        <View style={styles.healthBarRow}>
          <View style={[styles.healthBar, { backgroundColor: '#222', flex: 2 }]} />
          <View style={[styles.healthBar, { backgroundColor: '#222', flex: 2, marginLeft: 4 }]} />
          <View style={[styles.healthBar, { backgroundColor: '#222', flex: 1, marginLeft: 4 }]} />
          <View style={[styles.healthBar, { backgroundColor: '#eee', flex: 1, marginLeft: 4 }]} />
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
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowCalendar(false)}
        >
          <View style={styles.calendarModalContent}>
            <Calendar
              current={selectedDate.toISOString().split('T')[0]}
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#2196f3' }
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
    backgroundColor: '#fafbfc',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.5,
  },
  separator: {
    height: 1.25,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    marginHorizontal: -18,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 18,
    marginHorizontal: 4,
    color: '#222',
    fontWeight: '500',
  },
  shareBtn: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  scoreNum: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#222',
    lineHeight: 76,
  },
  scoreOutOf: {
    fontSize: 36,
    color: '#bbb',
    marginBottom: 10,
    marginLeft: 6,
    fontWeight: '500',
  },
  currentScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  currentScoreText: {
    fontSize: 18,
    color: '#888',
    marginRight: 4,
    fontWeight: '500',
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
    height: 200,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    minWidth: 100,
  },
  bar: {
    width: 100,
    borderRadius: 0,
    marginBottom: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  barWithTopBorder: {
    borderTopWidth: 4,
    borderTopColor: '#111',
  },
  barLastMonth: {
    height: 90,
    backgroundColor: 'transparent',
  },
  barLastWeek: {
    height: 135,
    backgroundColor: 'transparent',
  },
  barThisWeek: {
    height: 180,
    backgroundColor: '#2196f3',
    borderWidth: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  barThisWeekLabel: {
    position: 'absolute',
    bottom: 12,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  barThisWeekPercent: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  barLabelTop: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
    marginBottom: 2,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  barBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 2,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  barAvg: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    marginRight: 2,
  },
  barValue: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
    marginTop: 0,
    marginLeft: 0,
  },
  healthBox: {
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 22,
    marginTop: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthyText: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  keepText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 14,
    fontWeight: '500',
  },
  healthBarRow: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 2,
    height: 24,
  },
  healthBar: {
    borderRadius: 0,
  },
  healthBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  unhealthyLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  veryHealthyLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarModalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});
