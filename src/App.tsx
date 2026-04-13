import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AgencySettingsPage } from './pages/app/AgencySettingsPage';
import { BriefingsPage } from './pages/app/BriefingsPage';
import { ClientsPage } from './pages/app/ClientsPage';
import { CrmPage } from './pages/app/CrmPage';
import { HomePage } from './pages/app/HomePage';
import { ModulePlaceholderPage } from './pages/app/ModulePlaceholderPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { UserFormPage } from './pages/app/UserFormPage';
import { UsersListPage } from './pages/app/UsersListPage';
import { LoginPage } from './pages/auth/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute modules={['dashboard']}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route path='/perfil' element={<ProfilePage />} />

        <Route
          path='/crm/oportunidades'
          element={
            <ProtectedRoute modules={['crm']}>
              <CrmPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/clientes'
          element={
            <ProtectedRoute modules={['clients']}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/briefings'
          element={
            <ProtectedRoute modules={['briefings']}>
              <BriefingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/contratos'
          element={
            <ProtectedRoute modules={['contracts']}>
              <ModulePlaceholderPage
                title='Contratos'
                subtitle='Vigencia, status, escopo e contexto financeiro.'
                description='Contratos precisam equilibrar leitura gerencial e operacao do dia a dia, com cliente, vigencia e impacto no faturamento.'
                nextSteps={['Lista com vigencia, cliente e status.', 'Detalhe com resumo financeiro e marcos contratuais.', 'Navegacao cruzada com projetos e financeiro.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/servicos'
          element={
            <ProtectedRoute modules={['services']}>
              <ModulePlaceholderPage
                title='Servicos'
                subtitle='Catalogo de servicos conectado a operacao.'
                description='Servicos entram como referencia de escopo e estrutura operacional, sem virar um cadastro solto.'
                nextSteps={['Listagem com filtros e status.', 'Formulario objetivo e compativel com contracts e jobs.', 'Leitura cruzada em projetos e faturamento.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/projetos'
          element={
            <ProtectedRoute modules={['projects']}>
              <ModulePlaceholderPage
                title='Projetos'
                subtitle='Entrega com progresso, prazo, horas e risco.'
                description='Projetos vao concentrar a operacao da agencia, com contexto, status e navegacao para jobs e tasks.'
                nextSteps={['Portfolio com health badge e filtros persistentes.', 'Detalhe com contexto, atividade e proximos passos.', 'Relacao entre planejado, realizado e risco operacional.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/jobs'
          element={
            <ProtectedRoute modules={['projects', 'tasks']}>
              <ModulePlaceholderPage
                title='Jobs e Tasks'
                subtitle='Visao operacional diaria da producao.'
                description='Jobs e tasks pedem leitura rapida de prazo, owner, prioridade, bloqueio e relacao com apontamento de tempo.'
                nextSteps={['Lista operacional e visao por status.', 'Tela detalhe com anexos, contexto e atividade.', 'Entrada natural para apontamento de tempo e aprovacoes.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/time-entries'
          element={
            <ProtectedRoute modules={['time_entries', 'time-entries']}>
              <ModulePlaceholderPage
                title='Time Entries'
                subtitle='Apontamento rapido e leitura de esforco realizado.'
                description='A experiencia de horas precisa ser enxuta para uso diario e consistente para auditoria, faturamento e analise operacional.'
                nextSteps={['Minha visao e visao do time com filtros por periodo.', 'Entrada rapida conectada a projeto, job e task.', 'Preparacao para aprovacao e relacao com billing entries.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/arquivos/assets'
          element={
            <ProtectedRoute modules={['files']}>
              <ModulePlaceholderPage
                title='Arquivos e Assets'
                subtitle='Biblioteca criativa com versoes e rastreabilidade.'
                description='Assets vao ser objetos de trabalho com versao, revisao e contexto operacional.'
                nextSteps={['Biblioteca com filtros por cliente, projeto, job e task.', 'Detalhe com historico de versoes e comentarios.', 'Upload por signed URL do Supabase Storage.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/arquivos/aprovacoes'
          element={
            <ProtectedRoute modules={['files']}>
              <ModulePlaceholderPage
                title='Aprovacoes'
                subtitle='Fila e decisao de revisao com actions explicitas.'
                description='Aprovacao precisa usar as actions do backend com leitura forte de status e historico.'
                nextSteps={['Fila de aprovacoes por prioridade e prazo.', 'Painel de decisao com comentario e historico.', 'Ligacao direta com asset, versao e responsavel.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/financeiro/recebiveis'
          element={
            <ProtectedRoute modules={['finance']}>
              <ModulePlaceholderPage
                title='Recebiveis'
                subtitle='Invoices, billing entries e pagamentos.'
                description='Recebiveis precisam nascer com UI guiada por status para emissao, vencimento e liquidacao.'
                nextSteps={['Lista de invoices com estados fortes.', 'Acoes de mark-issued, mark-paid, mark-overdue e mark-void.', 'Resumo por cliente, contrato e projeto.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/financeiro/pagaveis'
          element={
            <ProtectedRoute modules={['finance']}>
              <ModulePlaceholderPage
                title='Pagaveis'
                subtitle='Controle de vendors, payables e pagamentos.'
                description='Pagaveis terao leitura operacional focada em vencimento, aprovacao, baixa parcial e valor em aberto.'
                nextSteps={['Lista de payables e vendors.', 'UI guiada por status para aprovacao e baixa.', 'Resumo tatico de vencimento e valor aberto.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/financeiro/fornecedores'
          element={
            <ProtectedRoute modules={['finance']}>
              <ModulePlaceholderPage
                title='Fornecedores'
                subtitle='Base de vendors conectada a operacao financeira.'
                description='Fornecedores apoiam contas a pagar e repasses, com consulta rapida e consistencia financeira.'
                nextSteps={['Lista com tipo, contato e vinculo operacional.', 'Navegacao para payables relacionados.', 'Preparacao para filtros por categoria e centro de custo.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/financeiro/relatorios'
          element={
            <ProtectedRoute modules={['finance']}>
              <ModulePlaceholderPage
                title='Relatorios Financeiros'
                subtitle='Resumo, por cliente e rentabilidade.'
                description='Os relatorios financeiros entram como camada executiva do ERP, com leitura clara e sem virar dashboard generico.'
                nextSteps={['Resumo financeiro consolidado.', 'Rentabilidade por cliente e projeto.', 'Comparacao com contexto operacional e horas.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/notificacoes'
          element={
            <ProtectedRoute modules={['notifications']}>
              <ModulePlaceholderPage
                title='Notificacoes'
                subtitle='Inbox operacional com leitura e arquivamento.'
                description='Notificacoes vao existir na shell e tambem como inbox completo, com acoes rapidas de leitura e prioridade.'
                nextSteps={['Inbox filtravel com status de leitura.', 'Badge global de nao lidas na shell.', 'Links diretos para a entidade relacionada quando houver action_url.']}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path='/configuracoes/agencia'
          element={
            <ProtectedRoute roles={['ADMIN', 'DIRETOR']}>
              <AgencySettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/configuracoes/usuarios'
          element={
            <ProtectedRoute permissions={['can_manage_users']}>
              <UsersListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/configuracoes/usuarios/novo'
          element={
            <ProtectedRoute permissions={['can_manage_users']}>
              <UserFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/configuracoes/usuarios/:id'
          element={
            <ProtectedRoute permissions={['can_manage_users']}>
              <UserFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/configuracoes/auditoria'
          element={
            <ProtectedRoute modules={['audit']}>
              <ModulePlaceholderPage
                title='Auditoria'
                subtitle='Logs de acao para rastreabilidade e revisao.'
                description='Auditoria tera leitura focada em investigacao, com filtros por modulo, ator, entidade e acao.'
                nextSteps={['Lista de logs com filtros taticos.', 'Detalhe do evento com payload relevante.', 'Acesso restrito por modulo e permissao do backend.']}
              />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
