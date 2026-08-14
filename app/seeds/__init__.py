from flask.cli import AppGroup
from .users import seed_users, undo_users
from .spots import undo_spots
from .demo import seed_demo_journal

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_demo_journal(seed_users())


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_spots()
    undo_users()
