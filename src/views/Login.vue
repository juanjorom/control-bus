<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-row align="center" justify="center">
                    <v-col md="6">
                        <v-card>
                            <v-card-title>
                                <span>Bienvenido</span>
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="form">
                                    <v-text-field v-model="form.server" ref="server" label="Servidor" :error-messages="getErrors('server')">
                                    </v-text-field>
                                    <v-text-field v-model="form.user" ref="user" label="Usuario" :error-messages="getErrors('user')">
                                    </v-text-field>
                                    <v-text-field v-model="form.password" ref="password" type="password" label="Contraseña" :error-messages="getErrors('password')">
                                    </v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn @click="validateUser" :disabled="sending">Entrar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
  import {
    required
  } from 'vuelidate/lib/validators'
export default {
    name: 'login',
    mixins: [validationMixin],
    data: () => ({
        form: {
            server: null,
            user: null,
            password: null,
        }
    }),
    computed: {
        ...mapGetters('logdata',{
            sending: 'getSending',
            getServers: 'getHostList',
            getUsers: 'getUsersList',
            succes: 'getSucess'
        })
    },
    validations: {
        form:{
            server: {
                required
            },
            user: {
                required,
            },
            password: {
                required,
            }
        }
    },
    methods: {
        ...mapActions('logdata', [
            'log',
        ]),
        getErrors (fieldName){
            const field = this.$v.form[fieldName]

            if (field) {
                const errors =[]
                if(!field.$dirty) return errors
                !field.required && errors.push("Se requiere este campo")
                return errors
            }
        },
        async validateUser () {
            this.$v.$touch()
            if (!this.$v.$invalid) {
                await this.log(this.form)
                if(this.succes){
                    this.$router.push('real')
                }
            }
        }
    }
}
</script>

<style>

</style>