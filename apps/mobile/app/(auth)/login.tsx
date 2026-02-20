import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSyncTicket, useLogin, useRegister } from '../../src/api/auth';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'ticket' | 'account'>('ticket');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // API hooks
  const { mutate: syncTicket, isPending: isSyncing } = useSyncTicket();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();

  const isPending = isSyncing || isLoggingIn || isRegistering;

  const handleTicketSync = () => {
    if (ticketId.length > 0) {
      syncTicket(ticketId);
    }
  };

  const handleAuth = () => {
    if (!email || !password) return;
    
    if (authMode === 'login') {
      login({ email, password });
    } else {
      register({ email, password, fullName });
    }
  };

  return (
    <View className="flex-1 bg-neutral-950 relative">
      <StatusBar barStyle="light-content" />
      
      {/* Background Ambience - Premium Aesthetic */}
      <View className="absolute w-full h-full left-0 top-0 overflow-hidden">
        <View className="w-[500px] h-[500px] absolute -right-20 -top-20 opacity-30 bg-red-600 rounded-full" style={{ filter: 'blur(100px)' }} />
        <View className="w-[600px] h-[600px] absolute -left-[200px] top-[300px] opacity-15 bg-blue-900 rounded-full" style={{ filter: 'blur(120px)' }} />
      </View>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
            <View className="flex-col justify-between flex-1">
              
              {/* Header */}
              <View className="items-center pt-8 pb-4">
                <View className="w-20 h-20 bg-red-600 rounded-3xl shadow-2xl shadow-red-500/50 justify-center items-center mb-6">
                  <Text className="text-white text-4xl font-black italic">CC</Text>
                </View>
                <Text className="text-white text-3xl font-bold text-center leading-9 mb-2 tracking-tight">
                  {activeTab === 'ticket' ? 'Race Ready' : (authMode === 'login' ? 'Welcome Back' : 'Join the Grid')}
                </Text>
                <Text className="text-slate-400 text-sm text-center font-normal px-4">
                  {activeTab === 'ticket' 
                    ? 'Sync your racing pass for full track access and live AR data.' 
                    : 'Access your account or create a new one to track your stats.'}
                </Text>
              </View>

              {/* Main Auth Card */}
              <View className="py-4 w-full">
                <View className="p-1.5 bg-white/5 rounded-[32px] border border-white/10 w-full overflow-hidden">
                  
                  {/* Glassmorphism Tab Switcher */}
                  <View className="flex-row p-1 bg-black/40 rounded-3xl gap-1">
                    <TouchableOpacity 
                      onPress={() => setActiveTab('ticket')}
                      className={`flex-1 rounded-2xl px-4 py-3.5 items-center justify-center ${activeTab === 'ticket' ? 'bg-red-600 shadow-xl' : ''}`}
                    >
                      <Text className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'ticket' ? 'text-white' : 'text-slate-500'}`}>
                        Fast Sync
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setActiveTab('account')}
                      className={`flex-1 rounded-2xl px-4 py-3.5 items-center justify-center ${activeTab === 'account' ? 'bg-red-600 shadow-xl' : ''}`}
                    >
                      <Text className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'account' ? 'text-white' : 'text-slate-500'}`}>
                        Account
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Form Content with Micro-animations (Implicit via mode switching) */}
                  <View className="px-5 pt-8 pb-6 gap-8">
                    {activeTab === 'ticket' ? (
                      <View className="gap-6">
                        <View className="relative w-full">
                          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Ticket ID</Text>
                          <TextInput
                            value={ticketId}
                            onChangeText={setTicketId}
                            placeholder="00000000"
                            placeholderTextColor="#334155"
                            className="h-14 bg-white/5 rounded-2xl px-4 text-white text-xl font-medium border border-white/5"
                            keyboardType="number-pad"
                          />
                        </View>

                        <View className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex-row gap-4 items-center">
                          <View className="w-10 h-10 rounded-full bg-red-500/20 justify-center items-center">
                            <Text className="text-red-500 text-lg">💡</Text>
                          </View>
                          <Text className="text-slate-400 text-xs font-medium leading-5 flex-1">
                            Find the 8-digit code on your pass or email.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="gap-5">
                        {authMode === 'register' && (
                          <View className="relative w-full">
                            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Full Name</Text>
                            <TextInput
                              value={fullName}
                              onChangeText={setFullName}
                              placeholder="Alex Albon"
                              placeholderTextColor="#334155"
                              className="h-12 bg-white/5 rounded-xl px-4 text-white text-base border border-white/5"
                            />
                          </View>
                        )}
                        <View className="relative w-full">
                          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Email Address</Text>
                          <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="racer@circuit.com"
                            placeholderTextColor="#334155"
                            className="h-12 bg-white/5 rounded-xl px-4 text-white text-base border border-white/5"
                            autoCapitalize="none"
                            keyboardType="email-address"
                          />
                        </View>
                        <View className="relative w-full">
                          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Password</Text>
                          <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#334155"
                            className="h-12 bg-white/5 rounded-xl px-4 text-white text-base border border-white/5"
                            secureTextEntry
                          />
                        </View>

                        <TouchableOpacity 
                          onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                          className="self-center py-2"
                        >
                          <Text className="text-red-500 text-xs font-semibold">
                            {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity 
                      onPress={activeTab === 'ticket' ? handleTicketSync : handleAuth}
                      disabled={isPending}
                      activeOpacity={0.8}
                      className={`h-16 rounded-2xl shadow-2xl shadow-red-600/30 flex-row justify-center items-center ${isPending ? 'bg-red-800' : 'bg-red-600'}`}
                    >
                      <Text className="text-white text-sm font-black uppercase tracking-[2px]">
                        {isPending ? 'Processing...' : (activeTab === 'ticket' ? 'Sync Access' : (authMode === 'login' ? 'Login' : 'Create Account'))}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Footer / Socials */}
              <View className="items-center w-full pb-8">
                <View className="w-full h-[1px] bg-white/10 mb-8" />
                
                <View className="flex-row w-full gap-4">
                  <TouchableOpacity className="flex-1 h-14 bg-white/5 rounded-2xl border border-white/5 justify-center items-center">
                    <Text className="text-slate-300 text-xs font-bold uppercase tracking-widest">Apple ID</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 h-14 bg-white/5 rounded-2xl border border-white/5 justify-center items-center">
                    <Text className="text-slate-300 text-xs font-bold uppercase tracking-widest">Google</Text>
                  </TouchableOpacity>
                </View>

                <View className="mt-10 px-6 py-2 bg-red-600/10 rounded-full border border-red-600/20 flex-row items-center gap-3">
                  <View className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500" />
                  <Text className="text-red-500 text-[9px] font-black uppercase tracking-[3px]">
                    AR Experience Optimized
                  </Text>
                </View>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
