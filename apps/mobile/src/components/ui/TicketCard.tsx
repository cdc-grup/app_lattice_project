import React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Ticket } from '../../types/models/auth';
import { colors } from '../../styles/colors';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface TicketCardProps {
  ticket: Ticket;
  index?: number;
  onCardPress?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, index = 0, onCardPress }) => {
  // Select a color scheme based on the zone
  const isTribuna = ticket.zoneName?.toLowerCase().includes('tribuna');
  const gradientColors = isTribuna 
    ? ['#E10600', '#8E1D18'] // Red for Tribuna
    : ['#5856D6', '#2D2B8A']; // Purple/Blue for others

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100)}
      style={styles.cardContainer}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onCardPress}
        style={{ flex: 1 }}
      >
        <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>CIRCUIT</Text>
            <Text style={styles.brandSub}>COPILOT</Text>
          </View>
          <View style={styles.headerRight}>
            <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="rgba(255,255,255,0.8)" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>ZONA</Text>
              <Text style={styles.value}>{ticket.zoneName || 'Pelouse'}</Text>
            </View>
            <View style={[styles.field, { alignItems: 'flex-end' }]}>
              <Text style={styles.label}>PORTA</Text>
              <Text style={styles.value}>{ticket.gate || '3'}</Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 24 }]}>
            <View style={styles.field}>
              <Text style={styles.label}>FILA</Text>
              <Text style={styles.value}>{ticket.seatRow || 'N/A'}</Text>
            </View>
            <View style={[styles.field, { alignItems: 'flex-end' }]}>
              <Text style={styles.label}>SEIENT</Text>
              <Text style={styles.value}>{ticket.seatNumber || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Footer / QR Section */}
        <View style={styles.footer}>
          <View style={styles.qrContainer}>
            {/* Using a placeholder QR for now */}
            <Image 
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.code}` }}
              style={styles.qrCode}
            />
          </View>
          <Text style={styles.ticketCode}>{ticket.code}</Text>
        </View>

        {/* Decorative elements */}
        <View style={styles.decorCircle} />
        <View style={styles.decorStripe} />
      </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: '#1C1C1E',
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 4,
    marginTop: -4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  field: {
    flex: 1,
  },
  label: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  qrContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCode: {
    width: 120,
    height: 120,
  },
  ticketCode: {
    marginTop: 12,
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    opacity: 0.5,
  },
  decorCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorStripe: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: [{ rotate: '-5deg' }, { scale: 1.5 }],
  }
});
