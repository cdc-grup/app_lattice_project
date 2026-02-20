import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSyncTicket, useLogin, useRegister } from '../../src/api/auth';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'ticket' | 'account'>('ticket');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // API hooks
  const { 
    mutate: syncTicket, 
    isPending: isSyncing, 
    error: syncError 
  } = useSyncTicket();
  
  const { 
    mutate: login, 
    isPending: isLoggingIn, 
    error: loginError 
  } = useLogin();
  
  const { 
    mutate: register, 
    isPending: isRegistering, 
    error: registerError 
  } = useRegister();

  const isPending = isSyncing || isLoggingIn || isRegistering;

  const handleTicketSync = () => {
    setErrorMessage(null);
    if (ticketId.length < 4) {
      setErrorMessage('Please enter a valid ticket ID');
      return;
    }
    syncTicket(ticketId, {
      onError: (err: any) => setErrorMessage(err.message)
    });
  };

  const handleAuth = () => {
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    if (authMode === 'login') {
      login({ email, password }, {
        onError: (err: any) => setErrorMessage(err.message)
      });
    } else {
      if (!fullName) {
        setErrorMessage('Full name is required');
        return;
      }
      register({ email, password, fullName }, {
        onError: (err: any) => setErrorMessage(err.message)
      });
    }
  };

  const currentError = errorMessage || (activeTab === 'ticket' ? syncError?.message : (authMode === 'login' ? loginError?.message : registerError?.message));

  return (
    <View className="flex-1 bg-background relative">
      <StatusBar barStyle="light-content" />
      
      {/* Background Ambience - Premium Aesthetic */}
      <View className="absolute w-full h-full left-0 top-0 overflow-hidden">
        <View className="w-[500px] h-[500px] absolute -right-20 -top-20 opacity-30 bg-primary rounded-full" style={{ filter: 'blur(100px)' }} />
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
                <View className="w-20 h-20 bg-primary rounded-3xl shadow-2xl shadow-primary/50 justify-center items-center mb-6">
                  <Text className="text-foreground text-4xl font-black italic">CC</Text>
                </View>
                <Text className="text-foreground text-3xl font-bold text-center leading-9 mb-2 tracking-tight">
                  {activeTab === 'ticket' ? 'Race Ready' : (authMode === 'login' ? 'Welcome Back' : 'Join the Grid')}
                </Text>
                <Text className="text-muted text-sm text-center font-normal px-4">
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
                      className={`flex-1 rounded-2xl px-4 py-3.5 items-center justify-center ${activeTab === 'ticket' ? 'bg-primary shadow-xl' : ''}`}
                    >
                      <Text className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'ticket' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Fast Sync
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setActiveTab('account')}
                      className={`flex-1 rounded-2xl px-4 py-3.5 items-center justify-center ${activeTab === 'account' ? 'bg-primary shadow-xl' : ''}`}
                    >
                      <Text className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'account' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Account
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Form Content with Micro-animations (Implicit via mode switching) */}
                  <View className="px-5 pt-8 pb-6 gap-8">
                    {activeTab === 'ticket' ? (
                      <View className="gap-6">
                        <View className="relative w-full">
                          <View className="flex-row items-center h-14 bg-white/5 rounded-2xl px-4 border border-border/10">
                            <TextInput
                              value={ticketId}
                              onChangeText={(text) => {
                                setTicketId(text);
                                setErrorMessage(null);
                              }}
                              placeholder="00000000"
                              placeholderTextColor="rgba(255,255,255,0.2)"
                              className="flex-1 text-foreground text-xl font-medium"
                              keyboardType="number-pad"
                            />
                            <TouchableOpacity 
                              onPress={() => alert('Scanner coming soon!')}
                              className="w-10 h-10 bg-primary/20 rounded-xl justify-center items-center"
                            >
                              <Ionicons name="qr-code" size={18} color="hsl(var(--primary))" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex-row gap-4 items-center">
                          <View className="w-10 h-10 rounded-full bg-primary/20 justify-center items-center">
                            <Text className="text-primary text-lg">💡</Text>
                          </View>
                          <Text className="text-muted text-xs font-medium leading-5 flex-1">
                            Find the 8-digit code on your pass or email.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="gap-5">
                        {authMode === 'register' && (
                          <View className="relative w-full">
                            <Text className="text-muted text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Full Name</Text>
                            <TextInput
                              value={fullName}
                              onChangeText={setFullName}
                              placeholder="Alex Albon"
                              placeholderTextColor="rgba(255,255,255,0.2)"
                              className="h-12 bg-white/5 rounded-xl px-4 text-foreground text-base border border-border/10"
                            />
                          </View>
                        )}
                        <View className="relative w-full">
                          <Text className="text-muted text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Email Address</Text>
                          <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="racer@circuit.com"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            className="h-12 bg-white/5 rounded-xl px-4 text-foreground text-base border border-border/10"
                            autoCapitalize="none"
                            keyboardType="email-address"
                          />
                        </View>
                        <View className="relative w-full">
                          <Text className="text-muted text-[10px] font-bold uppercase tracking-[2px] mb-2 px-1">Password</Text>
                          <View className="flex-row items-center h-12 bg-white/5 rounded-xl px-4 border border-border/10">
                            <TextInput
                              value={password}
                              onChangeText={(text) => {
                                setPassword(text);
                                setErrorMessage(null);
                              }}
                              placeholder="••••••••"
                              placeholderTextColor="rgba(255,255,255,0.2)"
                              className="flex-1 text-foreground text-base"
                              secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                              <Ionicons 
                                name={showPassword ? "eye-off" : "eye"} 
                                size={20} 
                                color="hsl(var(--muted-foreground))" 
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <TouchableOpacity 
                          onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                          className="self-center py-2"
                        >
                          <Text className="text-primary text-xs font-semibold">
                            {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {currentError && (
                      <View className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex-row items-center gap-2">
                        <Ionicons name="alert-circle" size={16} color="hsl(var(--primary))" />
                        <Text className="text-primary text-xs font-medium flex-1">
                          {currentError}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity 
                      onPress={activeTab === 'ticket' ? handleTicketSync : handleAuth}
                      disabled={isPending}
                      activeOpacity={0.8}
                      className={`h-16 rounded-2xl shadow-2xl shadow-primary/30 flex-row justify-center items-center ${isPending ? 'bg-primary/80' : 'bg-primary'}`}
                    >
                      <Text className="text-foreground text-sm font-black uppercase tracking-[2px]">
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
                  <TouchableOpacity className="flex-1 h-14 bg-white/5 rounded-2xl border border-border/10 justify-center items-center">
                    <Text className="text-muted text-xs font-bold uppercase tracking-widest">Apple ID</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 h-14 bg-white/5 rounded-2xl border border-border/10 justify-center items-center">
                    <Text className="text-muted text-xs font-bold uppercase tracking-widest">Google</Text>
                  </TouchableOpacity>
                </View>

                <View className="mt-10 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 flex-row items-center gap-3">
                  <View className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary" />
                  <Text className="text-primary text-[9px] font-black uppercase tracking-[3px]">
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
