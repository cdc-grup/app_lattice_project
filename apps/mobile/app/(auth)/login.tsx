import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSyncTicket } from '../../src/api/auth';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'ticket' | 'account'>('ticket');
  const [ticketId, setTicketId] = useState('');
  const { mutate: syncTicket, isPending } = useSyncTicket();

  const handleSync = () => {
    if (ticketId.length > 0) {
      syncTicket(ticketId);
    }
  };

  return (
    <View className="flex-1 bg-neutral-950 relative">
      <StatusBar barStyle="light-content" />
      
      {/* Background Ambience */}
      <View className="absolute w-full h-full left-0 top-0 overflow-hidden">
        <View className="w-[500px] h-[500px] absolute -left-10 -top-20 opacity-20 bg-red-500 rounded-full" style={{ filter: 'blur(100px)' }} />
        <View className="w-[800px] h-[600px] absolute -left-[400px] top-[280px] opacity-10 bg-red-900 rounded-full" style={{ filter: 'blur(120px)' }} />
      </View>

      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
          <View className="flex-col justify-between flex-1">
            
            {/* Header */}
            <View className="items-center pt-8 pb-6">
              <View className="w-16 h-16 bg-red-600 rounded-2xl shadow-lg shadow-red-500/40 justify-center items-center mb-6">
                <Text className="text-white text-3xl font-bold">CC</Text>
              </View>
              <Text className="text-white text-3xl font-bold text-center leading-9 mb-2">
                Welcome to the Grid
              </Text>
              <Text className="text-slate-400 text-sm text-center font-normal">
                Sync your pass or login to access race data.
              </Text>
            </View>

            {/* Main Card */}
            <View className="py-6 w-full">
              <View className="p-1 bg-white/5 rounded-3xl border border-white/10 w-full">
                
                {/* Tab Switcher */}
                <View className="flex-row p-1 bg-black/20 rounded-2xl gap-1">
                  <TouchableOpacity 
                    onPress={() => setActiveTab('ticket')}
                    className={`flex-1 rounded-xl px-4 py-3 items-center justify-center ${activeTab === 'ticket' ? 'bg-red-500 shadow-sm' : ''}`}
                  >
                    <Text className={`text-sm font-medium ${activeTab === 'ticket' ? 'text-white' : 'text-slate-400'}`}>
                      Fast Ticket Sync
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setActiveTab('account')}
                    className={`flex-1 rounded-xl px-4 py-3 items-center justify-center ${activeTab === 'account' ? 'bg-red-500 shadow-sm' : ''}`}
                  >
                    <Text className={`text-sm font-medium ${activeTab === 'account' ? 'text-white' : 'text-slate-400'}`}>
                      Account Sync
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Form Content */}
                <View className="px-5 pt-8 pb-5 gap-8">
                  {activeTab === 'ticket' ? (
                    <View className="gap-4">
                      <View className="relative w-full">
                        <Text className="text-slate-400 text-sm font-normal mb-1">Enter Ticket ID</Text>
                        <TextInput
                          value={ticketId}
                          onChangeText={setTicketId}
                          placeholder="00000000"
                          placeholderTextColor="#475569"
                          className="h-12 border-b border-slate-700 text-white text-lg"
                        />
                      </View>

                      <View className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 flex-row gap-3">
                        <View className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                        <Text className="text-red-500/80 text-xs font-normal leading-5 flex-1">
                          Use the 8-digit code found on your physical pass or email confirmation.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className="h-28 justify-center items-center">
                      <Text className="text-slate-400">Login with email coming soon</Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    onPress={handleSync}
                    disabled={isPending}
                    className="p-4 bg-red-500 rounded-xl shadow-lg shadow-red-500/40 flex-row justify-center items-center"
                  >
                    <Text className="text-white text-sm font-semibold uppercase tracking-wider">
                      {isPending ? 'Syncing...' : 'Sync Access'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer / Socials */}
            <View className="items-center gap-4 w-full pb-8">
              <TouchableOpacity>
                <Text className="text-slate-400 text-sm font-normal underline">
                  Need help finding your ticket?
                </Text>
              </TouchableOpacity>

              <View className="w-full py-4 items-center justify-center">
                <View className="absolute w-full h-[1px] bg-slate-800" />
                <View className="bg-neutral-950 px-4">
                  <Text className="text-slate-500 text-xs font-normal uppercase tracking-wider">
                    Or continue with
                  </Text>
                </View>
              </View>

              <View className="flex-row w-full gap-3">
                <TouchableOpacity className="flex-1 py-3 bg-white/5 rounded-xl border border-white/5 flex-row justify-center items-center gap-2">
                  <Text className="text-slate-300 text-sm font-medium">Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-3 bg-white/5 rounded-xl border border-white/5 flex-row justify-center items-center gap-2">
                  <Text className="text-slate-300 text-sm font-medium">Google</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 flex-row items-center gap-2">
                <View className="w-2 h-2 bg-red-500 rounded-full" />
                <Text className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
                  AR Experience Ready
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
