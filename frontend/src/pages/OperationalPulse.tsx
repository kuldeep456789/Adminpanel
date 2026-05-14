import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.tsx";
import { useStore } from "../store/useStore.ts";
import { DEMO_PROJECTS } from "../store/demoData.ts";
import { 
  Zap, 
  Search, 
  Database, 
  MessageSquare, 
  Ticket, 
  PhoneCall, 
  ChevronDown, 
  Activity, 
  ShieldCheck, 
  BrainCircuit, 
  Share2, 
  FileCode, 
  Github, 
  Terminal, 
  ShieldAlert, 
  GitPullRequest, 
  TestTube, 
  CheckCircle2,
  Users
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils.ts";

export default function OperationalPulse() {
  const { user, token, isDemoMode } = useStore();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      let data = isDemoMode ? DEMO_PROJECTS : [];
      if (!isDemoMode && token) {
        try {
          const res = await fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } });
          data = await res.json();
        } catch (err) { console.error(err); }
      }
      setProjects(data);
    };
    fetchProjects();
  }, [isDemoMode, token]);

  return (
    <AppShell>
      <div className="min-h-[90vh] bg-transparent flex flex-col items-center justify-center -mt-10">
        {/* Workflow Canvas */}
        <div className="relative w-full h-[750px] bg-transparent overflow-hidden">
          {/* SVG Connection Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
             <defs>
               <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="3.5" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>

               <marker
                 id="pulseArrow"
                 markerWidth="10"
                 markerHeight="7"
                 refX="9"
                 refY="3.5"
                 orient="auto"
               >
                 <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-accent)" className="opacity-50" />
               </marker>
             </defs>
             
             {/* 1. Source to Analysis */}
             <BezierCurve start={[280, 200]} end={[400, 300]} />
             <BezierCurve start={[280, 500]} end={[400, 300]} />
             
             {/* 2. Analysis to Agent */}
             <BezierCurve start={[650, 300]} end={[750, 300]} />
             
             {/* 3. Agent to Actions (Split) */}
             <BezierCurve start={[1030, 300]} end={[1150, 150]} />
             <BezierCurve start={[1030, 300]} end={[1150, 450]} />

             {/* 4. Actions to Verification */}
             <BezierCurve start={[1400, 150]} end={[1520, 300]} />
             <BezierCurve start={[1400, 450]} end={[1520, 300]} />

             {/* 5. Verification to Output */}
             <BezierCurve start={[1800, 300]} end={[1920, 300]} />
          </svg>

          {/* Nodes Layer */}
          <div className="relative h-full w-full py-10 z-20 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-20 px-8 min-w-max h-full">
              
              {/* STAGE 1: INGRESS */}
              <div className="flex flex-col gap-12">
                <Node 
                  title="Source Ingress"
                  icon={Github}
                  desc="Syncing repository & issue telemetry."
                  content={`Project: ${projects[0]?.name || 'SkyLine'}\nSource: github.com/pulse-net\nLast_Commit: 8f2d91a`}
                  footer="2.4ms Sync"
                  isUser
                />
                <Node 
                  title="Live Context"
                  icon={Activity}
                  desc="Ingesting real-time server logs."
                  content={`Log_Level: WARN\nError_ID: 0x42A\nFrequency: 12/min`}
                  footer="UDP_STREAM"
                />
              </div>

              {/* STAGE 2: TRIAGE */}
              <Node 
                title="Context Analysis"
                icon={Search}
                desc="Building semantic dependency map."
                content={`AST_Walk: COMPLETE\nRisk_Nodes: 3 detected\nRef_Project: ${projects[1]?.name || 'Nexus'}`}
                footer="V3.0.1-Triager"
              />

              {/* STAGE 3: THE BRAIN */}
              <Node 
                title="Pulse Agent"
                icon={BrainCircuit}
                desc="AI reasoning with tool orchestration."
                className="w-80"
                agentDetails={{
                  model: "Claude-3.5-Sonnet (Pro)",
                  knowledgeBases: ["System_Architecture_v2", "Fix_History"],
                  tools: [GitPullRequest, Terminal, ShieldCheck]
                }}
              />

              {/* STAGE 4: EXECUTION (Split) */}
              <div className="flex flex-col gap-12">
                <Node 
                  title="Self-Healing"
                  icon={GitPullRequest}
                  desc="Generating PR for code fixes."
                  content={`Patch: auth_hotfix.ts\nTarget: master\nStatus: PR_OPENED_#142`}
                  footer="AUTO_RESOLVE"
                  size="sm"
                />
                <Node 
                  title="Infra Patching"
                  icon={Terminal}
                  desc="Optimizing resource allocation."
                  content={`Action: SCALE_UP\nTarget: Node_Cluster_A\nStatus: IN_PROGRESS`}
                  footer="SYSOPS_AGENT"
                  size="sm"
                />
              </div>

              {/* STAGE 5: VALIDATION */}
              <Node 
                title="Verification"
                icon={TestTube}
                desc="Running security & regression suite."
                content={`Unit_Tests: 42/42 PASSED\nSecurity_Scan: CLEAN\nBuild: SUCCESS`}
                footer="CI/CD_VALIDATOR"
              />

              {/* STAGE 6: RESOLUTION */}
              <Node 
                title="Final Resolution"
                icon={CheckCircle2}
                desc="Delivering resolution to stakeholders."
                outputContent={`Analysis Complete: 100% Corrective\n\n• Fixed auth latency anomaly\n• Scaled cluster infrastructure\n• Notified Project Owner (${projects[0]?.clientName || 'Admin'})\n\nSystem Health: OPTIMAL`}
                footer="RESOLVED_42ms"
              />

            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// --- Specialized Components ---

function Node({ title, icon: Icon, desc, content, footer, className, size = 'md', agentDetails, outputContent, isUser }: any) {
  return (
    <div className={cn(
      "bg-transparent border border-border/10 rounded-xl flex flex-col backdrop-blur-2xl transition-all duration-500 hover:border-accent/40 hover:bg-accent/5 group relative overflow-hidden",
      size === 'sm' ? "w-60 p-4" : "w-64 p-5",
      className
    )}>
      {/* Tech Corners */}
      <div className="tech-corner top-0 left-0 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="tech-corner top-0 right-0 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="tech-corner bottom-0 left-0 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="tech-corner bottom-0 right-0 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Visual Enhancements */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent h-60 -top-full group-hover:animate-scan pointer-events-none z-0" />
      
      {isUser && (
        <div className="absolute top-0 right-0 p-4 opacity-30 pointer-events-none">
          <div className="w-32 h-32 rounded-full border border-accent/20 bg-accent/10 blur-3xl animate-pulse" />
        </div>
      )}

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl border border-border/20 bg-background/40 flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          {isUser ? <Users className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-text uppercase tracking-[0.15em] leading-tight">{title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
             <div className={cn("w-2 h-2 rounded-full", isUser ? "bg-accent animate-ping" : "bg-muted")} />
             <span className="text-[9px] font-black text-accent uppercase tracking-widest">{isUser ? "Active_Handshake" : "Signal_Standby"}</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted/80 mb-4 leading-relaxed font-medium relative z-10">{desc}</p>

      {content && (
        <div className="p-4 bg-background/30 rounded-xl mb-4 border border-border/5 backdrop-blur-md relative z-10 group-hover:border-accent/10 transition-colors">
           <pre className="text-[10px] font-mono font-bold text-text/80 whitespace-pre-wrap leading-tight">
             {content}
           </pre>
        </div>
      )}

      {agentDetails && (
        <div className="space-y-5 mb-5 relative z-10">
           <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-center justify-between backdrop-blur-sm">
              <span className="text-xs font-black text-text italic uppercase tracking-widest">{agentDetails.model}</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-accent animate-bounce" />
                <div className="w-1 h-1 rounded-full bg-accent animate-bounce delay-75" />
                <div className="w-1 h-1 rounded-full bg-accent animate-bounce delay-150" />
              </div>
           </div>
           <div>
              <p className="text-[9px] font-black text-muted/60 uppercase tracking-[0.3em] mb-3">Intelligence_Buffers</p>
              <div className="space-y-2.5">
                 {agentDetails.knowledgeBases.map((kb: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-border/10 rounded-xl bg-background/20 hover:bg-background/40 transition-all">
                       <Database className="w-3.5 h-3.5 text-accent" />
                       <span className="text-[10px] font-bold text-muted">{kb}</span>
                    </div>
                 ))}
              </div>
           </div>
           <div>
              <p className="text-[9px] font-black text-muted/60 uppercase tracking-[0.3em] mb-3">Operational_Tools</p>
              <div className="flex gap-2.5">
                 {agentDetails.tools.map((T: any, i: number) => (
                    <div key={i} className="p-3 border border-border/10 rounded-xl bg-background/40 hover:border-accent/50 hover:bg-background/60 hover:text-accent transition-all cursor-none group/tool relative">
                       <T className="w-4 h-4" />
                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full scale-0 group-hover/tool:scale-100 transition-transform" />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {outputContent && (
        <div className="flex-1 flex flex-col mb-5 relative z-10">
          <div className="p-5 bg-accent/[0.04] border border-accent/20 rounded-2xl text-[11px] leading-relaxed text-text backdrop-blur-md shadow-[inset_0_0_20px_rgba(var(--color-accent-rgb),0.05)]">
             {outputContent.split('\n').map((line, i) => (
               <p key={i} className={cn(line.startsWith('•') ? "ml-3 mt-2 text-accent font-black" : "mt-2.5 first:mt-0 font-bold opacity-90")}>
                 {line}
               </p>
             ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-border/10 mt-auto relative z-10">
        <button className="flex items-center gap-2 text-[10px] font-black text-muted hover:text-accent uppercase tracking-[0.25em] transition-all">
           Systems <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <span className="text-[8px] font-mono text-accent/30 tracking-tighter animate-flicker uppercase">0x{Math.random().toString(16).slice(2, 6)}</span>
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
           <span className="text-[10px] font-mono font-bold text-accent tracking-tighter">{footer}</span>
        </div>
      </div>
    </div>
  );
}

function BezierCurve({ start, end }: { start: [number, number], end: [number, number] }) {
  const [sx, sy] = start;
  const [ex, ey] = end;
  
  const cp1x = sx + (ex - sx) * 0.4;
  const cp1y = sy;
  const cp2x = sx + (ex - sx) * 0.6;
  const cp2y = ey;

  const path = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;

  return (
    <g>
      {/* Static background shadow path */}
      <path
        d={path}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1.5"
        className="opacity-5"
      />
      
      {/* Technical direction path with arrowhead */}
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        className="opacity-10"
        markerEnd="url(#pulseArrow)"
      />

      {/* Animated flow pulse */}
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeDasharray="60 250"
        animate={{ strokeDashoffset: [310, 0] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        filter="url(#lineGlow)"
        className="opacity-40"
      />

      {/* High-speed data photon */}
      <motion.circle
        r="4"
        fill="var(--color-accent)"
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ offsetPath: `path('${path}')` }}
        initial={{ offsetDistance: "0%" }}
        animate={{ 
          offsetDistance: "100%",
          scale: [1, 2, 1],
          opacity: [0.4, 1, 0.4]
        }}
        filter="url(#lineGlow)"
        className="z-50"
      />
    </g>
  );
}
