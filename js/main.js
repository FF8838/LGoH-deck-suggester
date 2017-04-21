var teamHeroes = new Team();
var allHeroes = new Team();

$.getJSON("data/heroes_all.json", function(json) {
    json.forEach(function (heroStat) {
        allHeroes.addHero(heroStat);
    });
});

function getHeroesTableComponent(team) {
    return {
        template: '#heroes-table',
        props: ['affinity'],
        data: function () {
            return { team: team, searchKey: ''};
        },
        computed : {
            filteredHeroes: function () {
                var self = this;
                return self.team.getHeroes({'affinity': this.affinity}).filter(function (hero) {
                    return hero.name.toLowerCase().indexOf(self.searchKey.toLowerCase()) !== -1;
                });
            }
        }
    }
}

Vue.component('heroes-table', {
    template: '#heroes-table',
    props: ['affinity']
});

Vue.component('team-heroes-list', {
    template: '#heroes-list',
    data: function (){
        return {
            listId: 'team-heroes-list'
        };
    },
    components: {
        'heroes-table': getHeroesTableComponent(teamHeroes)
    },
    mounted: function () {
        $('#team-heroes-list a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }
});

Vue.component('all-heroes-list', {
    template: '#heroes-list',
    data: function () {
        return {
            listId: 'all-heroes-list'
        };
    },
    components: {
        'heroes-table': getHeroesTableComponent(allHeroes)
    },
    mounted: function () {
        $('#all-heroes-list a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }
});

Vue.component('team-adding-form', {
    template: '#team-adding-form',
    props: ['affinity'],
    data: function () {
        return {
            allHeroes: allHeroes,
            teamHeroes: teamHeroes
        };
    },
    computed : {
        heroes: function () {
            return allHeroes.getHeroes();
        },
        affinities: function () {
            return ['Fire', 'Water', 'Earth', 'Light', 'Dark'];
        }
    },
    updated: function () {
        $('#team-adding').find('select').selectpicker('refresh');
    },
    methods: {
        addHeroToTeam: function (e) {
            e.preventDefault();

            var formParams = {};
            $.each($(e.target).serializeArray(), function(_, kv) {
                formParams[kv.name] = kv.value;
            });

            var hero = $.extend({}, allHeroes.heroes[formParams.id], formParams);
            teamHeroes.addHero(hero);
        }
    }
});

new Vue({
    el: '#app',
    mounted: function () {
        $('#page-nav a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }
});
